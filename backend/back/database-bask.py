"""
BACKUP of the original back/database.py (pre-sprint-1 security migration).
Kept for reference during the migration. Do not import this module.
"""


def convertOperator(operator):
    match operator:
        case 'contains':
            return '__contains'
        case 'startsWith':
            return '__startswith'
        case 'endsWith':
            return '__endswith'
        case 'equals':
            return '__exact'
        case 'notEquals':
            return '__iexact'
        case 'doesNotContain':
            return '__contains'
        case 'isEmpty':
            return '__exact'
        case 'isNotEmpty':
            return '__exact'
        case 'isAnyOf':
            return '__in'
