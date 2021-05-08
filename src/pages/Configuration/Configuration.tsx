import React, { useEffect, useRef, useState } from 'react';
import { Button, FileUploader, Popup, TextBox, ValidationGroup, Validator } from 'devextreme-react';
import { Link } from 'react-router-dom';
import { CompareRule, RequiredRule } from 'devextreme-react/validator';
import { UserContext, ChangePassword as CPModel } from '../../models';
import { Auth } from '../../services';
import notify from 'devextreme/ui/notify';

const PersonalData = () => {
  const validationGroupEl = useRef<any>(null);
  const [model, setModel] = useState<Partial<UserContext>>({
    name: Auth.userContext.name,
    lastName: Auth.userContext.lastName,
    email: Auth.userContext.email,
    profileImage: Auth.userContext.profileImage
  });
  const [textVisible, setTextVisible] = useState<boolean>(true);
  const [isDropZoneActive, setIsDropZoneActive] = useState<boolean>(false);
  const [image, setImage] = useState<File[]>([]);

  useEffect(() => {
    setTextVisible(image.length == 0);
  }, [image]);
  useEffect(() => {
    if (model.profileImage)
      setTextVisible(false);
  }, []);

  const onSubmit = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {

      var form = new FormData();
      form.append('name', model.name!);
      form.append('lastName', model.lastName!);

      if (image && image.length > 0)
        form.append('image', image[0]);

      Auth.updateUser(form).then((data) => {
        notify({ message: `Datos actualizados correctamente!`, width: 'auto' }, "success", 4500);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
    }
  }

  var imageContent = null;

  if (image && image.length > 0)
    imageContent = (<img id="dropzone-image" src={URL.createObjectURL(image[0])} alt="" />);
  else if (model && model.profileImage)
    imageContent = (<img id="dropzone-image" src={model.profileImage} alt="" />);


  return (
    <div>
      <h3>Datos de usuario</h3>
      <div style={{ margin: '0 3em' }}>
        <ValidationGroup ref={validationGroupEl}>
          <div>
            <div id="dropzone-external" className={`flex-box ${isDropZoneActive ? 'dx-theme-accent-as-border-color dropzone-active' : 'dx-theme-border-color'}`}>
              {imageContent}
              {textVisible &&
                <div id="dropzone-text" className="flex-box">
                  <span>Arrastra y suelta</span>
                  <span> …o haz click para buscar la imagen.</span>
                </div>
              }
            </div>
            <FileUploader
              dialogTrigger="#dropzone-external"
              multiple={false}
              visible={false}
              accept="image/*"
              uploadMode="useForm"
              allowCanceling
              dropZone="#file-zone"
              onDropZoneEnter={({ dropZoneElement }) => {
                if (dropZoneElement && dropZoneElement.id === 'dropzone-external') {
                  setIsDropZoneActive(true);
                }
              }}
              onDropZoneLeave={({ dropZoneElement }) => {
                if (dropZoneElement && dropZoneElement.id === 'dropzone-external') {
                  setIsDropZoneActive(false);
                }
              }}
              value={image}
              onValueChanged={({ value }) => {
                setImage(value!)
              }
              }
            />
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
            <label>E-mail</label>
            <TextBox
              value={model?.email}
              readOnly
            />
          </div>
          <div className="form-input" style={{ textAlign: 'right' }}>
            <Button
              className="btn-secondary"
              text={'GUARDAR CAMBIOS'}
              width="auto"
              height="40px"
              stylingMode={'text'}
              type="normal"
              style={{ marginTop: '10px' }}
              onClick={onSubmit}
            />
          </div>
        </ValidationGroup>

      </div>
    </div>
  );
};

const ChangePassword = () => {
  const validationGroupEl = useRef<any>(null);
  const [model, setModel] = useState<Partial<CPModel>>({});

  const onSubmit = () => {

    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      Auth.changeCurrentPassword(model as CPModel).then((data) => {
        setModel({});
        notify({ message: `Contraseña actualizada correctamente!`, width: 'auto' }, "success", 4500);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
    }
  }

  return (
    <div>
      <h3>Cambiar contraseña</h3>
      <div style={{ margin: '0 3em' }}>
        <ValidationGroup ref={validationGroupEl}>
          <div className="form-input">
            <label>Contraseña actual</label>
            <TextBox
              value={model?.currentPassword}
              mode="password"
              onValueChange={(value) => setModel(prev => ({ ...prev, currentPassword: value }))}
            >
              <Validator>
                <RequiredRule message={'La contraseña actual es requerida'} />
              </Validator>
            </TextBox>
          </div>
          <div className="form-input">
            <label>Nueva contraseña</label>
            <TextBox
              value={model?.newPassword}
              mode="password"
              onValueChange={(value) => setModel(prev => ({ ...prev, newPassword: value }))}
            >
              <Validator>
                <RequiredRule message={'La nueva contraseña es requerida'} />
              </Validator>
            </TextBox>
          </div>
          <div className="form-input">
            <label>Repetir contraseña</label>
            <TextBox
              mode="password"
              value={model?.repeatPassword}
              onValueChange={(value) => setModel(prev => ({ ...prev, repeatPassword: value }))}
            >
              <Validator>
                <RequiredRule message={'Repetir contraseña es requerido'} />
                <CompareRule
                  message="Las contraseñas no coinciden"
                  comparisonTarget={() => model?.newPassword}
                />
              </Validator>
            </TextBox>
          </div>
          <div className="form-input" style={{ textAlign: 'right' }}>
            <Button
              className="btn-secondary"
              text={'GUARDAR CAMBIOS'}
              width="auto"
              height="40px"
              stylingMode={'text'}
              type="normal"
              style={{ marginTop: '10px' }}
              onClick={onSubmit}
            />
          </div>
        </ValidationGroup>

      </div>
    </div>
  );
};

const Configuration: React.FC<any> = ({ visible, onHidden }) => {
  //const popUpEl = useRef<Popup>(null);
  const [activeOption, setActiveOption] = useState<number>(1);

  return (
    <Popup
      //ref={popUpEl}
      position={{ my: 'center', at: 'center', of: window, offset: { y: 0 } }}
      visible={visible}
      onHiding={onHidden}
      // dragEnabled={false}
      // closeOnOutsideClick={true}
      // showTitle={false}
      title="Configuración"
      shadingColor="rgba(0,0,0, 0.3)"
      width="60%"
      height="60%"
    >
      <div className="configuration-popup">
        <div className="menu-section">
          <div className="first-options">
            <Button
              icon="user"
              text={'Datos de usuario'}
              width="auto"
              height="40px"
              stylingMode={'text'}
              style={{ marginTop: '10px' }}
              onClick={() => setActiveOption(1)}
              className={activeOption === 1 ? 'menu-item-selected' : ''}
            />
            <Button
              icon="key"
              text={'Cambiar contraseña'}
              width="auto"
              height="40px"
              stylingMode={'text'}
              style={{ marginTop: '10px' }}
              onClick={() => setActiveOption(2)}
              className={activeOption === 2 ? 'menu-item-selected' : ''}
            />
          </div>
        </div>
        <div className="content-section">
          {activeOption === 1 && (
            <PersonalData />
          )}
          {activeOption === 2 && (
            <ChangePassword />
          )}
        </div>
      </div>
    </Popup >
  );
}

export default Configuration;