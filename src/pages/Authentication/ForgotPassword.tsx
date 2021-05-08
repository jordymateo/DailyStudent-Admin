import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Auth } from '../../services';
import notify from "devextreme/ui/notify";
import { RequiredRule, Validator } from 'devextreme-react/validator';
import { Button, TextBox, ValidationGroup } from 'devextreme-react';
import LoadingButton from '../../components/Buttons/LoadingButton';
import Images from '../../assets/images';


const ForgotPassword = () => {

  const history = useHistory();
  const validationGroupEl = useRef<ValidationGroup>(null);

  const [sending, setSending] = useState<boolean>(false);

  const [email, setEmail] = useState<string>();



  const onSubmit = (e: any) => {
    e.preventDefault();
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      setSending(true);

      Auth.forgotPassword(email!)
        .then((res: any) => {
          setSending(false);
          history.push('/sign_in');
          notify({ message: "Se ha enviado un correo eléctronico a su E-mail.", width: 'auto' }, "success", 4500);
        })
        .catch((response: any) => {
          setSending(false);
          notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
        });
    }
  }

  return (
    <form onSubmit={onSubmit} className="form-md">
      <div className="content-logo">
        <img src={Images.Logo} alt="" />
        <label>Recuperar contraseña</label>
      </div>
      <div className="content-form">
        <ValidationGroup ref={validationGroupEl}>
          <div className="form-input">
            <label>Correo eléctronico</label>
            <TextBox
              onValueChange={(value) => setEmail(value)}
              value={email}
            >
              <Validator>
                <RequiredRule message={'Se requiere su nombre'} />
              </Validator>
            </TextBox>
          </div>
          <div className="content-action">
            <Button
              icon={'back'}
              text={'Volver'}
              height="40px"
              stylingMode={'text'}
              className="button-dark"
              onClick={() => history.push('/sign_in')}
            />
            <LoadingButton
              loading={sending}
              text="Enviar correo"
              loadingText="Verificando"
              className="btn-primary"
              width="140px"
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

export default ForgotPassword;