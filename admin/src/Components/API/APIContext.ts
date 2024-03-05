import React from 'react'
import API from './API'

const APIContext = React.createContext<API | undefined>( undefined );

export const { Provider, Consumer } = APIContext;
export default APIContext;