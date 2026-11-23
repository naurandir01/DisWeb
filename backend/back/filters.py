# backend/back/filters.py
"""Whitelisted server-side filtering for DataGrid-driven views.

Every view declares the ORM lookups it accepts. Anything outside the
whitelist is rejected with 400 instead of being passed to the ORM.

Also fixes the incorrect operator mappings from the legacy
back/database.py (kept as back/database-bask.py during migration):
- doesNotContain was mapped to __contains (inverted behaviour)
- notEquals was mapped to __iexact
- isEmpty/isNotEmpty were mapped to __exact
Negated operators are now implemented with queryset.exclude().
"""
from rest_framework.exceptions import ValidationError

# Operator name (MUI DataGrid) -> Django lookup suffix.
OPERATOR_MAP = {
    "contains": "__icontains",
    "doesNotContain": "__contains",  # negation handled by exclude(), see NEGATED_OPERATORS
    "equals": "__exact",
    "notEquals": "__exact",          # negation via exclude()
    "startsWith": "__istartswith",
    "endsWith": "__iendswith",
    "greaterThan": "__gt",
    "lessThan": "__lt",
    "isAnyOf": "__in",
}

# Operators whose ORM lookup must be applied with queryset.exclude()
NEGATED_OPERATORS = {"doesNotContain", "notEquals"}

# Operators that ignore the filter value
NULL_OPERATORS = {"isEmpty", "isNotEmpty"}


def sanitize_field(field, allowed_fields):
    """Validate a filter field against a whitelist.

    allowed_fields maps grid field name -> ORM field name, e.g.
    {"key": "reg_key", "ts": "reg_ts"}
    """
    if field not in allowed_fields:
        raise ValidationError(f"Filtering on '{field}' is not allowed")
    return allowed_fields[field]


def build_filter_kwargs(field, operator, value, allowed_fields):
    """Return (kwargs, negated) for use with queryset.filter()/exclude().

    Raises ValidationError on anything not whitelisted.
    """
    if operator in NULL_OPERATORS:
        orm_field = sanitize_field(field, allowed_fields)
        return ({f"{orm_field}__isnull": True}, operator == "isEmpty")

    if operator not in OPERATOR_MAP:
        raise ValidationError(f"Operator '{operator}' is not allowed")

    orm_field = sanitize_field(field, allowed_fields)
    lookup = OPERATOR_MAP[operator]
    negated = operator in NEGATED_OPERATORS

    if value in (None, ""):
        raise ValidationError("Filter value is required for this operator")

    # isAnyOf arrives as a comma-separated list from the grid
    if operator == "isAnyOf" and isinstance(value, str):
        value = [v.strip() for v in value.split(",") if v.strip()]

    return ({f"{orm_field}{lookup}": value}, negated)


def apply_grid_filters(queryset, request, allowed_fields):
    """Apply DataGrid filter/sort params from the request to a queryset."""
    filter_field = request.query_params.get("filtermodel[0][field]")
    filter_operator = request.query_params.get("filtermodel[0][operator]")
    filter_value = request.query_params.get("filtermodel[0][value]")

    if filter_field:
        kwargs, negated = build_filter_kwargs(
            filter_field, filter_operator or "", filter_value, allowed_fields
        )
        queryset = queryset.exclude(**kwargs) if negated else queryset.filter(**kwargs)

    sort_field = request.query_params.get("sortingmodel[0][field]")
    sort_order = request.query_params.get("sortingmodel[0][sort]") or "asc"
    if sort_field:
        orm_field = sanitize_field(sort_field, allowed_fields)
        prefix = "-" if sort_order == "desc" else ""
        queryset = queryset.order_by(f"{prefix}{orm_field}")

    return queryset
