const CLASSROOM_REQUEST_SERVICE = 'service_aclassroom_requests'

function buildVirtualColumn ({ templateCol, field, label, width, orderOffset = -0.5 }) {
  return {
    ...templateCol,
    _id: `virtual_${field}`,
    col_id: `virtual_${field}`,
    col_field: field,
    col_key: field,
    col_type: 'string',
    col_order: Number(templateCol.col_order || 0) + orderOffset,
    col_hidden: false,
    tableHidden: false,
    configHidden: false,
    form: {
      ...templateCol.form,
      label,
      prop: field
    },
    props: {
      ...templateCol.props,
      label,
      width
    }
  }
}

export function enhanceClassroomRequestTableConfig (tableName, data) {
  if (!data || tableName !== CLASSROOM_REQUEST_SERVICE || !Array.isArray(data.columns)) {
    return data
  }

  const planCol = data.columns.find((col) => col.col_field === 'student_plan')
  if (!planCol) {
    return data
  }

  const planIndex = data.columns.findIndex((col) => col.col_field === 'student_plan')
  const insertIndex = planIndex === -1 ? data.columns.length : planIndex
  const nextColumns = data.columns.filter((col) => col.col_field !== 'payment_info')

  if (!nextColumns.some((col) => col.col_field === 'payment_info')) {
    nextColumns.splice(
      insertIndex,
      0,
      buildVirtualColumn({
        templateCol: planCol,
        field: 'payment_info',
        label: 'Төлбөр',
        width: '220px',
        orderOffset: -0.5
      })
    )
  }

  data.columns = nextColumns
  return data
}
