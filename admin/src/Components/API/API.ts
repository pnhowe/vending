import Vending, { Products_Product, Products_ProductGroup } from './Vending'
import { Cookies } from 'react-cookie'

export default class API
{
  vending: Vending;
  cookies: Cookies;

  constructor( cookies: Cookies )
  {
    this.cookies = cookies;
    this.vending = new Vending( "http://localhost:8888" );

    const username = this.cookies.get( 'username' );
    const token = this.cookies.get( 'token' );

    if( username !== undefined && token !== undefined )
    {
      this.vending.setHeader( 'AUTH-ID', username );
      this.vending.setHeader( 'AUTH-TOKEN', token );
    }
  }

  isAuthencated(): boolean
  {
    const username = this.cookies.get( 'username' );
    const token = this.cookies.get( 'token' );

    return ( username !== undefined && token !== undefined );
  }

  async login( username: string, password: string ): Promise<void>
  {
    const auth_token = await this.vending.Auth_User_call_login( username, password );
    this.cookies.set( 'username', username, { sameSite: 'strict' } );
    this.cookies.set( 'token', auth_token, { sameSite: 'strict' } );
  }

  async logout(): Promise<void>
  {
    this.cookies.remove( 'username' );
    this.cookies.remove( 'token' );

    await this.vending.Auth_User_call_logout();
  }

  async getUserInfo(): Promise<string | undefined>
  {
    if( !this.isAuthencated() )
      return new Promise<string | undefined>( ( resolve )=> { resolve( 'anonymous' ); } );

    const info = await this.vending.Auth_User_call_whoami().catch( () => { return undefined } );

    if( info === undefined )
      await this.logout();

    return info;
  }

  async getProductGroups(): Promise<Record<string, Products_ProductGroup>>
  {
    return await this.vending.Products_ProductGroup_get_multi( { count: 100 } );
  }

  async getProducts(): Promise<Record<string, Products_Product>>
  {
    return await this.vending.Products_Product_get_multi( { count: 100 } );
  }
}