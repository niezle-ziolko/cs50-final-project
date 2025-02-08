import 'styles/css/theme/forms.css';


export default function Login() {
  return (
    <div className='login-form'>
      <form className='form'>
        <p className='heading'>Sign in</p>
        <input className='input' placeholder='Username' type='text' />
        <input className='input' placeholder='Password' type='password' /> 
        <button className='btn'>Submit</button>
      </form>
    </div>
  );
};