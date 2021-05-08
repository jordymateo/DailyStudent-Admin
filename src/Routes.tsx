import React, { useEffect, useState } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { AuthLayout, Loading, MainLayout } from './components/Layouts';
import { ChangePassword, ForgotPassword, SignIn } from './pages/Authentication';
import { Auth } from './services';
import { locale, loadMessages } from "devextreme/localization";
import esMessages from "devextreme/localization/messages/es.json";
import { CreatePopup as InstitutionsPopup, Institutions } from './pages/Institutions';
import { Users } from './pages/Users';
import { Careers, Pensum } from './pages/Careers';


const SecurityRoutes: React.FC<any> = ({ history, location }) => {
  const [loading, setLoading] = useState(true);
  const [authIsValid, setAuthIsValid] = useState(false);

  useEffect(() => {
    Auth
      .loadUserData()
      .then((isValid) => {
        setAuthIsValid(isValid);
        setTimeout(() => {
          setLoading(false);
        }, 2500)
      })
      .catch((err) =>
        setTimeout(() => {
          setAuthIsValid(false);
          setLoading(false);
        }, 2500)
      );
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!authIsValid && !loading) {
    Auth.signOut();
    history.push("/sign_in");
  }

  return (
    <MainLayout>
      <>
        <Switch>
          <Route path="/users" component={Users} />
          <Route path="/institutions" component={Institutions} />
          <Route path="/careers" component={Careers} />
          <Route path="/pensum/:id" component={Pensum} />
          <Route path="/" component={Users} />
        </Switch>
        <Route exact path="/institutions/create" component={InstitutionsPopup} />
      </>
    </MainLayout>
  );
};

const GuestRoutes = () => {
  return (
    <AuthLayout>
      <Switch>
        <Route path="/sign_in" component={SignIn} />
        <Route path="/forgot_password" component={ForgotPassword} />
        <Route path="/cp/:tk" component={ChangePassword} />
        <Redirect to="/sign_in" />
      </Switch>
    </AuthLayout>
  )
}



const Routes = () => {
  //language
  loadMessages(esMessages);
  locale(navigator.language);

  return (
    <HashRouter basename={"/"}>
      <Route
        render={(_) =>
          Auth.isAuthenticated ? (
            <Route path="*" component={SecurityRoutes} />
          ) : (
            <Route path="*" component={GuestRoutes} />
          )
        }
      />
    </HashRouter>
  );
};

export default Routes;