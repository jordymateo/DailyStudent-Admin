import React, { useEffect, useRef, useState } from 'react';
import { ICreateProps, InstitutionForm } from './types';
import { Button, FileUploader, Popup, SelectBox, TextBox, ValidationGroup, Validator } from "devextreme-react";
import { RequiredRule } from 'devextreme-react/validator';
import { CountriesService, InstitutionsService } from '../../services';
import { Country } from '../../models';
import notify from 'devextreme/ui/notify';


const Create: React.FC<ICreateProps> = ({ data, visible, onHidden, onDataChanged }) => {

  const popUpEl = useRef<Popup>(null);
  const validationGroupEl = useRef<any>(null);
  const [model, setModel] = useState<Partial<InstitutionForm>>({ logo: [] });
  const [countries, setCountries] = useState<Country[]>();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    CountriesService.get().then(data => setCountries(data));
  }, []);

  useEffect(() => {
    if (data) {
      setModel({ ...data, logo: [] });
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setModel({ logo: [] });

      const instance = validationGroupEl.current!.instance;
      instance.reset();
    }
  }, [data]);

  const onSubmit = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      var form = new FormData();
      form.append('acronym', model.acronym!);
      form.append('name', model.name!);
      form.append('website', model.website!);
      form.append('countryId', model.countryId!.toString());
      form.append('logo', model.logo![0]);

      if (isEditing) {
        form.append('id', model.id!.toString());
        InstitutionsService
          .update(form).then((data) => {
            onDataChanged();
            popUpEl.current?.instance.toggle(false);
            notify({ message: 'Institución actualizada correctamente!', width: 'auto' }, "success", 4500);
            setModel({ logo: [] });
            instance.reset();
          }).catch((response: any) => {
            notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
          });
      } else {
        InstitutionsService
          .create(form).then((data) => {
            onDataChanged();
            popUpEl.current?.instance.toggle(false);
            notify({ message: 'Institución creada correctamente!', width: 'auto' }, "success", 4500);
            setModel({ logo: [] });
            instance.reset();
          }).catch((response: any) => {
            notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
          });
      }
    }
  };

  return (
    <Popup
      ref={popUpEl}
      position={{ my: 'center', at: 'center', of: window, offset: { y: 0 } }}
      visible={visible}
      onHiding={onHidden}
      dragEnabled={false}
      showTitle={true}
      shadingColor="rgba(0,0,0, 0.3)"
      title={`${isEditing ? 'Editar' : 'Registrar'} institución académica`}
      width={"40%"}
      height="auto"
    >
      <ValidationGroup ref={validationGroupEl}>
        <div className="form-input">
          <label>Acrónimo</label>
          <TextBox
            value={model?.acronym}
            onValueChange={(value) => setModel(prev => ({ ...prev, acronym: value }))}
          >
            <Validator>
              <RequiredRule message={'El acrónimo es requerido'} />
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
          <label>Sitio web</label>
          <TextBox
            value={model?.website}
            onValueChange={(value) => setModel(prev => ({ ...prev, website: value }))}
          >
            <Validator>
              <RequiredRule message={'El sitio web es requerido'} />
            </Validator>
          </TextBox>
        </div>
        <div className="form-input">
          <label>País</label>
          <SelectBox
            items={countries}
            placeholder="Elige un país"
            valueExpr="id"
            displayExpr="name"
            value={model.countryId}
            onValueChange={(value) => setModel(prev => ({ ...prev, countryId: value }))}
          >
            <Validator>
              <RequiredRule message={'El país es requerido'} />
            </Validator>
          </SelectBox>
        </div>
        <div className="form-input" id="file-zone">
          <label>Logo</label>
          <FileUploader
            multiple={false}
            accept="image/*"
            uploadMode="useForm"
            allowCanceling
            dropZone="#file-zone"
            value={model?.logo}
            onValueChanged={({ value }) => setModel(prev => ({ ...prev, logo: value ? value : [] }))}
          />
        </div>
        <div className="form-input" style={{ textAlign: 'right' }}>
          <Button
            className="btn-secondary"
            text={'GUARDAR'}
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

export default Create;