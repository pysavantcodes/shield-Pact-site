import styled from 'styled-components';


const Button = styled.button`
	background-image:linear-gradient(135deg, #bc82d6, #9404d8);
	color:white;
	padding:0.65rem;
	border-radius:10px;
	font-weight:bold;
	font-size:1rem;
	cursor:pointer;

	&:hover{
		transition:.5s;
		transform:scale(1.02);
	}
`;

const FormButton = styled(Button)`
	width:100%;
	background:#a338d4a1;
	padding:1.25rem;
	
	&:hover{
		background:#a750cf;
	}

	&:last-child{
		background:#a750cf;
		&:hover{
			background:#a338d4a1;
		}
	}
`;


export {Button, FormButton};