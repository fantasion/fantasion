import { Form, FormControls, Input, useValidator } from './forms'
import { string } from 'yup'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'next-i18next'

import styles from './login.module.scss'
import formStyles from './forms.module.scss'

const inputTypeFor = (fieldType) => {
  if (fieldType === 'textarea') {
    return 'textarea'
  }
  if (fieldType === 'email') {
    return 'email'
  }
  if (fieldType === 'tel') {
    return 'tel'
  }
  return 'text'
}

const buildValidatorShape = (fields, t) => {
  const shape = {}
  for (const field of fields) {
    let schema = string().nullable()
    if (field.type === 'email') {
      schema = schema.email()
    }
    if (field.required) {
      schema = schema.required(t('form-input-required'))
    }
    shape[field.key] = schema
  }
  return shape
}

export const EventSignupForm = ({ fields, onSubmit }) => {
  const { t } = useTranslation()
  const startedAt = useRef(Date.now())
  const signupFields = fields || []

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  const shape = useMemo(
    () => buildValidatorShape(signupFields, t),
    [signupFields, t]
  )
  const resolver = useValidator(shape)

  const defaultValues = useMemo(() => {
    const values = { website: '' }
    for (const field of signupFields) {
      values[field.key] = ''
    }
    return values
  }, [signupFields])

  const handleSubmit = (values) => {
    const answers = {}
    for (const field of signupFields) {
      answers[field.key] = values[field.key] || ''
    }
    return onSubmit({
      answers,
      website: values.website || '',
      form_started: String(startedAt.current),
    })
  }

  return (
    <Form
      className={styles.form}
      defaultValues={defaultValues}
      id="event-signup"
      onSubmit={handleSubmit}
      resolver={resolver}
    >
      {signupFields.map((field) => (
        <Input
          key={field.key}
          label={field.label}
          name={field.key}
          required={field.required}
          rows={field.type === 'textarea' ? 3 : undefined}
          type={inputTypeFor(field.type)}
        />
      ))}
      {/* Honeypot: hidden from people, bots often fill it */}
      <div className={formStyles.honeypot} aria-hidden="true">
        <Input
          label="Website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <FormControls submitLabel={t('event-signup-submit')} />
    </Form>
  )
}
