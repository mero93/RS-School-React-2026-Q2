import { type ChangeEvent, type SyntheticEvent, useState } from 'react';
import { createFormSchema } from '../../schemas/form.schema';
import {
  checkPasswordStrength,
  convertFileToBase64,
} from '../../utils/formHelpers';
import './Forms.css';
import { useModalStore } from '../../store/useModal.store';
import { useFormStore } from '../../store/useForm.store';

export default function UncontrolledForm() {
  const { countries, addSubmission } = useFormStore();
  const { closeModal } = useModalStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordValue, setPasswordValue] = useState('');

  const schema = createFormSchema(countries);
  const check = checkPasswordStrength(passwordValue);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  };

  const handleFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const fileInput = form.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const files = fileInput?.files;

    const rawData = {
      name: formData.get('name') as string,
      age: formData.get('age') ? Number(formData.get('age')) : Number.NaN,
      email: formData.get('email') as string,
      gender: formData.get('gender') as string,
      country: formData.get('country') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      image: files,
      acceptedTerms: formData.get('acceptedTerms') === 'on',
    };

    const validationResult = schema.safeParse(rawData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const pathKey = issue.path[0] as string;
        if (!fieldErrors[pathKey]) {
          fieldErrors[pathKey] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const base64Avatar = await convertFileToBase64(files![0]);

      addSubmission({
        name: validationResult.data.name,
        age: validationResult.data.age,
        email: validationResult.data.email,
        gender: validationResult.data.gender as 'male' | 'female' | 'other',
        acceptedTerms: validationResult.data.acceptedTerms,
        country: validationResult.data.country,
        imageString: base64Avatar,
      });

      setErrors({});
      form.reset();
      setPasswordValue('');
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="profile-form" noValidate>
      <div className="field-group">
        <label htmlFor="uc-name">Full Name</label>
        <input id="uc-name" name="name" type="text" />
        {errors.name && <span className="error-msg">{errors.name}</span>}
      </div>

      <div className="field-group">
        <label htmlFor="uc-age">Age</label>
        <input id="uc-age" name="age" type="number" />
        {errors.age && <span className="error-msg">{errors.age}</span>}
      </div>

      <div className="field-group">
        <label htmlFor="uc-email">Email Address</label>
        <input id="uc-email" name="email" type="email" />
        {errors.email && <span className="error-msg">{errors.email}</span>}
      </div>

      <div className="field-group">
        <label htmlFor="uc-gender">Gender</label>
        <select id="uc-gender" name="gender">
          <option value="">Select Gender...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <span className="error-msg">{errors.gender}</span>}
      </div>

      <div className="field-group">
        <label htmlFor="uc-country">Country</label>
        <input id="uc-country" name="country" list="uc-countries-list" />
        <datalist id="uc-countries-list">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.country && <span className="error-msg">{errors.country}</span>}
      </div>

      <div className="field-group">
        <label htmlFor="uc-password">Password</label>
        <input
          id="uc-password"
          name="password"
          type="password"
          onChange={handlePasswordChange}
        />
        {errors.password && (
          <span className="error-msg">{errors.password}</span>
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
        <label htmlFor="uc-confirmPassword">Confirm Password</label>
        <input id="uc-confirmPassword" name="confirmPassword" type="password" />
        {errors.confirmPassword && (
          <span className="error-msg">{errors.confirmPassword}</span>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="uc-image">Profile Picture</label>
        <input id="uc-image" type="file" accept="image/png, image/jpeg" />
        {errors.image && <span className="error-msg">{errors.image}</span>}
      </div>

      <div className="field-group checkbox-group">
        <input id="uc-terms" name="acceptedTerms" type="checkbox" />
        <label htmlFor="uc-terms">I accept terms and conditions</label>
        {errors.acceptedTerms && (
          <span className="error-msg">{errors.acceptedTerms}</span>
        )}
      </div>

      <button type="submit" className="submit-btn">
        Submit Profile
      </button>
    </form>
  );
}
