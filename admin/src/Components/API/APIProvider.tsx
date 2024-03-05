import React from "react"
import { Cookies } from "react-cookie"
import API from './API'
import { Provider } from './APIContext'

type APIProps = {
  cookies: Cookies;
  children?: any;
  ref?: React.RefObject<{}>;
}

export default class APIProvider extends React.Component<APIProps, any>
{
  api: API;

  constructor( props: APIProps )
  {
    super( props );

    this.api = new API( this.props.cookies );
    this.api.login('root', 'root');
  }

  render()
  {
    return <Provider value={ this.api }>{ this.props.children }</Provider>;
  }
}