import React, { useRef, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Auth } from '../../services';
import notify from "devextreme/ui/notify";
import { RequiredRule, Validator } from 'devextreme-react/validator';
import { TextBox, ValidationGroup } from 'devextreme-react';
import LoadingButton from '../../components/Buttons/LoadingButton';
import Images from '../../assets/images';


const SignIn = () => {

  const history = useHistory();
  const location = useLocation();
  const validationGroupEl = useRef<ValidationGroup>(null);

  const [sending, setSending] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      setSending(true);

      Auth.signIn({
        Email: userName!,
        Password: password!
      })
        .then((res: any) => {
          const { from }: any = location.state || {
            from: { pathname: "/" }
          };

          console.log(from);
          setSending(false);
          history.push('/');
        })
        .catch((err: any) => {
          setSending(false);
          notify({ message: err.data.errors, width: 'auto' }, "error", 4500);
        });
    }
  }

  return (
    <form onSubmit={onSubmit} className="form-md">
      <div className="content-logo">
        <img src={Images.Logo} alt="" />
        <label>Iniciar sesión (ADMIN)</label>
      </div>
      <div className="content-form">
        <ValidationGroup ref={validationGroupEl}>
          <div className="form-input">
            <label>Correo electrónico</label>
            <TextBox onValueChanged={({ value }) => setUserName(value)}>
              <Validator>
                <RequiredRule message={'El correo electrónico es requerido'} />
              </Validator>
            </TextBox>
          </div>

          <div className="form-input">
            <label>Contraseña</label>
            <TextBox mode={'password'} onValueChanged={({ value }) => setPassword(value)}>
              <Validator>
                <RequiredRule message={'La contraseña es requerida'} />
              </Validator>
            </TextBox>
          </div>
          <div className="content-label" style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link className="label-link" to="/forgot_password">¿Olvidaste tu contraseña? <b>Recuperar</b></Link>
          </div>
          <div style={{ paddingTop: '10px' }}>
            <LoadingButton
              loading={sending}
              text="Acceder"
              loadingText="Comprobando"
              className="btn-primary"
              width="100%"
              height="40px"
              type={'default'}
              stylingMode={'contained'}
              useSubmitBehavior={true}
            />
          </div>
        </ValidationGroup>
      </div>
    </form>
  );

}

export default SignIn;