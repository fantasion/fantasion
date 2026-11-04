import { Form, FormControls, Input } from './forms'
import { useTranslation } from 'next-i18next'

import styles from './login.module.scss'

export const EventSignupForm = ({ onSubmit }) => {
  const { t } = useTranslation()
  return (
    <Form className={styles.form} id="event-signup" onSubmit={onSubmit}>
      <Input label={t('event-signup-name')} name="name" required />
      <Input label={t('event-signup-email')} name="email" type="email" required />
      <Input label={t('event-signup-phone')} name="phone" type="tel" />
      <Input
        label={t('event-signup-note')}
        name="note"
        type="textarea"
        rows={3}
      />
      <FormControls submitLabel={t('event-signup-submit')} />
    </Form>
  )
}
