import { useContext } from "react";
import API from './API';
import APIContext from './APIContext';

export default function useAPI(): API
{
  const api = useContext( APIContext );

  if( !api )
    throw new Error( 'Missing APIContext' );

  return api;
}