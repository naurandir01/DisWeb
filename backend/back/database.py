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
