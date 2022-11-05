import styled from 'styled-components';
import {statusType, statusCreate, defaultSection, customActionCreate, createController} from '../customModal/controller';

import {Info, Success, Failed, Process, Base, BASECOLOR} from './customModal/model';

const ComponentWrap = (Section, header)=>({handlers, content, ClickOutSideModalFunc})=>{
	return <Base header={header} content={<Section {...handlers} {...content}/>} baseColor={BASECOLOR.default}
					ClickOutSideModalFunc={ClickOutSideModalFunc}/>
}


const Controller = createController({
	"Home":
})