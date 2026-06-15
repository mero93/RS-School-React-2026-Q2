import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '../../store/useForm.store';
import { useModalStore } from '../../store/useModal.store';
import {
  createFormSchema,
  type FormFieldsData,
} from '../../schemas/form.schema';
import {
  convertFileToBase64,
  checkPasswordStrength,
} from '../../utils/formHelpers';
import './Forms.css';

export default function HookForm() {
  const { countries, addSubmission } = useFormStore();
  const { closeModal } = useModalStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    control,
  } = useForm<FormFieldsData>({
    resolver: zodResolver(createFormSchema(countries)),
    mode: 'onChange',
  });

  const passwordValue = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });
  const check = checkPasswordStrength(passwordValue);

  const onFormSubmit = async (data: FormFieldsData) => {
    try {
      const file = data.image[0];
      const base64Image = await convertFileToBase64(file);

      addSubmission({
        ...data,
        gender: data.gender as 'male' | 'female' | 'other',
        imageString: base64Image,
      });

      reset();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="profile-form"
      noValidate
    >
      <div className="field-group">
        <label htmlFor="hf-name">Full Name</label>
        <input id="hf-name" {...register('name')} />
        {errors.name && (
          <span className="error-msg">{errors.name.message}</span>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="hf-age">Age</label>
        <input
          id="hf-age"
          type="number"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && <span className="error-msg">{errors.age.message}</span>}
      </div>

      <div className="field-group">
        <label htmlFor="hf-email">Email Address</label>
        <input id="hf-email" {...register('email')} />
        {errors.email && (
          <span className="error-msg">{errors.email.message}</span>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="hf-gender">Gender</label>
        <select id="hf-gender" {...register('gender')}>
          <option value="">Select Gender...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <span className="error-msg">{errors.gender.message}</span>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="hf-country">Country</label>
        <input
          id="hf-country"
          list="hf-countries-list"
          {...register('country')}
        />
        <datalist id="hf-countries-list">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.country && (
          <span className="error-msg">{errors.country.message}</span>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="hf-password">Password</label>
        <input id="hf-password" type="password" {...register('password')} />
        {errors.password && (
          <span className="error-msg">{errors.password.message}</span>
        )}

        {passwordValue && (
          <div className="strength-meter">
            <p>Password Strength Checklist:</p>
            <span className={check.hasUpper ? 'pass' : 'fail'}>
              ✓ Uppercase
            </span>
            <span className={check.hasLower ? 'pass' : 'fail'}>
              ✓ Lowercase
            </span>
            <span className={check.hasNumber ? 'pass' : 'fail'}>✓ Number</span>
            <span className={check.hasSpecial ? 'pass' : 'fail'}>
              ✓ Special Char
            </span>
          </div>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="hf-confirmPassword">Confirm Password</label>
        <input
          id="hf-confirmPassword"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className="error-msg">{errors.confirmPassword.message}</span>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="hf-image">Profile Picture</label>
        <input id="hf-image" type="file" {...register('image')} />
        {errors.image && (
          <span className="error-msg">
            {typeof errors.image.message === 'string'
              ? errors.image.message
              : 'Invalid file'}
          </span>
        )}
      </div>

      <div className="field-group checkbox-group">
        <input id="hf-terms" type="checkbox" {...register('acceptedTerms')} />
        <label htmlFor="hf-terms">I accept terms and conditions</label>
        {errors.acceptedTerms && (
          <span className="error-msg">{errors.acceptedTerms.message}</span>
        )}
      </div>

      <button type="submit" className="submit-btn" disabled={!isValid}>
        Submit Profile
      </button>
    </form>
  );
}
