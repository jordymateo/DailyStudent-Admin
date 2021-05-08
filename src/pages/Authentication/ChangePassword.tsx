import React, { useRef, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Auth } from '../../services';
import notify from "devextreme/ui/notify";
import { CompareRule, PatternRule, RequiredRule, Validator } from 'devextreme-react/validator';
import { Button, TextBox, ValidationGroup } from 'devextreme-react';
import LoadingButton from '../../components/Buttons/LoadingButton';
import Images from '../../assets/images';
import { ChangePassword2 } from '../../models';


const ChangePassword = () => {

  const history = useHistory();
  const { params }: any = useRouteMatch();
  const validationGroupEl = useRef<ValidationGroup>(null);

  const [sending, setSending] = useState<boolean>(false);

  const [model, setModel] = useState<Partial<ChangePassword2>>();

  const onSubmit = (e: any) => {
    e.preventDefault();
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      setSending(true);

      Auth.changePassword({ ...model, tk: params['tk'] } as ChangePassword2)
        .then((res: any) => {
          setSending(false);
          history.push('/sign_in');
          notify({ message: "Se ha realizado el cambio de contraseña de forma exitosa!", width: 'auto' }, "success", 4500);
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
        <label>Cambiar contraseña</label>
      </div>
      <div className="content-form">
        <ValidationGroup ref={validationGroupEl}>
          <div className="form-input">
            <TextBox
              mode={'password'}
              onValueChange={(value) => setModel(prev => ({ ...prev, newPassword: value }))}
              value={model?.newPassword}
              placeholder='Contraseña'>
              <Validator>
                <RequiredRule message={'La contraseña es requerida'} />
                <PatternRule
                  message="La contraseña debe poseer al menos 6 caracteres e incluir mayusculas, minusculas y números"
                  pattern={/(?=^.{6,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/}
                />
              </Validator>
            </TextBox>
          </div>
          <div className="form-input">
            <TextBox
              mode={'password'}
              placeholder='Confirme contraseña'
              onValueChange={(value) => setModel(prev => ({ ...prev, repeatPassword: value }))}
              value={model?.repeatPassword}
            >
              <Validator>
                <RequiredRule message={'La contraseña es requerida'} />
                <CompareRule message="La contraseña y la confirmacion no son iguales" comparisonType="===" comparisonTarget={() => model?.newPassword} />
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
              text="Guardar cambios"
              loadingText="Guardando"
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

export default ChangePassword;