import React, { useEffect, useRef, useState } from "react";
import { Button, DropDownBox, TextBox, TreeView } from "devextreme-react";
import Images from "../../assets/images";
import { Menu } from "./parts/MenuSidebar/Menu";
import { UserOption } from "./parts/UserOptionSidebar/UserOption";
import { FooterSideBar } from "./parts/Footer";
import { InstitutionsService } from "../../services";
import { useHistory } from "react-router-dom";
import CustomStore from "devextreme/data/custom_store";


export const Sidebar: React.FC = () => {

  const history = useHistory();
  const [selected, setSelected] = useState();
  const [institutions, setInstitutions] = useState<any>();
  const treeView = useRef<TreeView>();
  const dropDownBox = useRef<DropDownBox | any>();

  const onSelectionChange = ({ event, itemData }: any) => {
    if (event && itemData && itemData.courseTypeId && itemData.courseTypeId === 'course') {
      setSelected(itemData);
      history.push(`/courses/${itemData.id}`);
      dropDownBox.current?.instance.close();
    }
  }


  return (
    <div className="side-bar">
      <div className="menu-options">
        <Button
          icon={'menu'}
          width="auto"
          height="40px"
          stylingMode={'text'}
          className="button-dark"
          style={{ marginTop: '10px' }}
        />
        <img src={Images.Logo} />
        <label>Daily Student (Admin)</label>
      </div>
      <Menu />
      <UserOption />
    </div>
  );
}