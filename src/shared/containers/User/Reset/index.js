import React from 'react';
import styled from 'styled-components';
import style from 'Shared/style-variables';
import { users } from 'lunes-lib';
import { connect } from 'react-redux';

// Components
import PanelLeft from './PanelLeft';
import PanelRight from './PanelRight';
import { Logo } from 'Components/Logo';
import { Link, CustomLink } from 'Components/Link';
import { Img } from 'Components/Img';
import { H3 } from 'Components/H3';
import { H1 } from 'Components/H1';
import { P } from 'Components/P';
import { FormBuilder } from 'Components/FormBuilder';
import { ButtonSecondary } from 'Components/Buttons';

const CustomLogo = Logo.extend`
	margin: 70px auto 0 auto;
`;

const CustomLinkRight = CustomLink.extend`
	text-align: right;
`;

const CircleLink = CustomLink.extend`
	background-color: white;
	border: 0;
	border-radius: 100%;
	height: 40px;
	width: 40px;
`;

const ArrowImg = Img.extend`
	border-style: none;
	padding-top: 14px;
`;

const CustomForm = styled.form`
	width: 80%;
	display: block;
	margin: 25px auto 0 auto;
`;

const SecondPanelLeft = PanelLeft.extend`
	display: none;
`;

const inputs = [
	{ 
		className: 'reset-email',  
		placeholder: 'E-mail',
		type: 'email' 
	}
];

class Reset extends React.Component {
	handleSubmit = (event) => {
		event.preventDefault();
		let emailEl = document.querySelector('.reset-email');
		this.props.userReset(emailEl.value);	
	}
	componentDidMount() {
	}
	componentDidUpdate() {
		this.handleStatus();
	}
	handleStatus() {
		let firstPanelEl = document.querySelector('.js-first-panel-left');
		let secondPanelEl = document.querySelector('.js-second-panel-left');
		let statusEl = document.querySelector('.js-status');
		
		let { status } = this.props.user;

		if (status === 'pending') {
			statusEl.textContent = 'Aguarde...';
		} else if (status === 'fulfilled') {
			firstPanelEl.style.display  = 'none';
			secondPanelEl.style.display = 'block';
			statusEl.textContent = 'Sucesso';
		} else if (status === 'rejected') {
			statusEl.textContent = 'Tente novamente';
		}
	}
	render() {
		let { status, logged } = this.props.user;

		return (
			<div>
				<PanelLeft className={'js-first-panel-left'}>
					<CustomLogo/>

					<H1 clNormalGreen txCenter margin={'100px auto 0 auto'}>Esqueceu sua senha?</H1>
					<P clWhite txCenter margin={'20px'} fontSize={'1.4rem'}>
						Nós enviaremos suas instruções de como redefini-la.
					</P>
					<CustomForm onSubmit={this.handleSubmit}>
						<FormBuilder inputs={inputs}/>
						<CustomLinkRight to={'/login'} margin={'0 auto 25px auto'}>Fazer login?</CustomLinkRight>
						<ButtonSecondary type={'submit'}>
							Resgatar
						</ButtonSecondary>
					</CustomForm>

					<H1 txCenter clWhite margin={'20px 0 0 0'} className={'js-status'}></H1>

					<P clWhite txCenter margin={'20% 0 10px 0'} fontSize={'1.4rem'}>
						Não tem uma conta? <CustomLink to={"/registry"} color={`${style.normalGreen}`}>Inscrever-se.</CustomLink>
					</P>
				</PanelLeft>

				<SecondPanelLeft className={'js-second-panel-left'}>
					<CustomLogo/>
					<Img src={'img/ic_email.svg'} margin={'130px auto 0 auto'} width={'80px'} />
					<H1 txCenter clWhite margin={'20px'}>
						Uma mensagem com link de definição de senha foi enviado para o seu endereço de e-mail.
					</H1>
					<CircleLink to={'/login'} margin={'50px auto 10px auto'}>
						<ArrowImg src={'img/right-arrow.svg'} margin={'auto'} width={'20px'} />				
					</CircleLink>
				</SecondPanelLeft>

				<PanelRight/>
			</div>
		);
	}
}


const mapDispatchToProps = (dispatch) => {
	return {
		userReset: (email) => {
			dispatch({
				type: 'USER_RESET',
				payload: users.resetPassword({ 
					email
				})
			});
		}
	}
}
const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Reset);