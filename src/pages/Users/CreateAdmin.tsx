import React, { useRef, useState } from "react";
import { Button, Popup, TextBox, ValidationGroup, Validator } from "devextreme-react";
import { ICreateAdminProps, IUserModel } from "./types";
import { User } from "../../models";
import { CompareRule, EmailRule, RequiredRule } from "devextreme-react/validator";
import { UsersService } from "../../services";
import notify from "devextreme/ui/notify";

const CreateAdmin: React.FC<ICreateAdminProps> = ({ visible, onHidden, onDataChanged }) => {

  const popUpEl = useRef<Popup>(null);
  const validationGroupEl = useRef<ValidationGroup>(null);
  const [model, setModel] = useState<Partial<IUserModel>>();

  const onSubmit = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      UsersService.signUpAdmin({
        FirstName: model?.name!,
        LastName: model?.lastName!,
        Email: model?.email!,
        Password: model?.password!
      }).then((data) => {
        onDataChanged();
        popUpEl.current?.instance.toggle(false);
        notify({ message: `Administrador creado correctamente!`, width: 'auto' }, "success", 4500);
        setModel({});
        instance.reset();
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
    }
  }

  return (
    <Popup
      ref={popUpEl}
      position={{ my: 'center', at: 'center', of: window, offset: { y: 0 } }}
      visible={visible}
      onHiding={onHidden}
      dragEnabled={false}
      showTitle={true}
      shadingColor="rgba(0,0,0, 0.3)"
      title={"Crear administrador"}
      width={"40%"}
      height="auto"
    >
      <ValidationGroup ref={validationGroupEl}>
        <div className="form-input">
          <label>E-mail</label>
          <TextBox
            value={model?.email}
            onValueChange={(value) => setModel(prev => ({ ...prev, email: value }))}
          >
            <Validator>
              <RequiredRule message={'El e-mail es requerido'} />
              <EmailRule message="El e-mail es invalido" />
            </Validator>
          </TextBox>
        </div>
        <div className="form-input">
          <label>Nombre</label>
          <TextBox
            value={model?.name}
            onValueChange={(value) => setModel(prev => ({ ...prev, name: value }))}
          >
            <Validator>
              <RequiredRule message={'El nombre es requerido'} />
            </Validator>
          </TextBox>
        </div>
        <div className="form-input">
          <label>Apellido</label>
          <TextBox
            value={model?.lastName}
            onValueChange={(value) => setModel(prev => ({ ...prev, lastName: value }))}
          >
            <Validator>
              <RequiredRule message={'El apellido es requerido'} />
            </Validator>
          </TextBox>
        </div>
        <div className="form-input">
          <label>Contraseña</label>
          <TextBox
            value={model?.password}
            mode={'password'}
            onValueChange={(value) => setModel(prev => ({ ...prev, password: value }))}
          >
            <Validator>
              <RequiredRule message={'La contraseña es requerida'} />
            </Validator>
          </TextBox>
        </div>
        <div className="form-input">
          <label>Repetir contraseña</label>
          <TextBox
            mode={'password'}
            //onValueChange={(value) => setModel(prev => ({ ...prev, title: value }))}
          >
            <Validator>
              <RequiredRule message={'Repetir contraseña es requerido'} />
              <CompareRule
                message="Las contraseñas no coinciden"
                comparisonTarget={() => model?.password}
              />
            </Validator>
          </TextBox>
        </div>
        <div className="form-input" style={{ textAlign: 'right' }}>
          <Button
            className="btn-secondary"
            text={'COMPLETAR'}
            width="auto"
            height="40px"
            stylingMode={'text'}
            type="normal"
            style={{ marginTop: '10px' }}
            onClick={onSubmit}
          />
        </div>
      </ValidationGroup>
    </Popup>
  );
}

export default CreateAdmin;