import React, { Component } from "react";

import { Col, Row } from "Components/index";
import { ButtonGreen } from "Components/Buttons";
import { numeral } from 'Utils/numeral';
import { InputText } from 'Components/forms/input-text';
import { LeasingClass } from 'Classes/Leasing';
import { WalletClass } from 'Classes/Wallet';
import ModalConfirm from './confirm';

import { TESTNET } from 'Config/constants';

// Lunes-lib
import { networks } from 'lunes-lib';

// REDUX
import { connect } from 'react-redux';
import { setLeasingAmount } from 'Redux/actions';

import {
    Background,
    QuantityAmount,
    LeasingStyleModalCss,
    Close,
    Rectangle,
    TextCenter,
    Image,
    CoinValue,
    Line,
    NumberPorcent,
    DivNumber,
    DivButton,
    DivText,
    TextLeft,
    LineText,
    Textphrase,
    TextFee,
    Message
} from "./css";

class LeasingModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '-<br />-',
            amount: 0,
            toAddress: '',
            isValidAddress: false,
            openConfirmModal: false,
            buttonState: true,

        }

        this.setInputValue = this.setInputValue.bind(this);
        this.toggleConfirmModal = this.toggleConfirmModal.bind(this);
    }

    resetStateClose = () => {
        this.setState({
            message: '-<br />-',
            amount: 0,
            toAddress: '',
            isValidAddress: false,
            openConfirmModal: false,
            buttonState: true
        })
        this.setInputValue = this.setInputValue.bind(this);
        this.toggleConfirmModal = this.toggleConfirmModal.bind(this);
    }

    validateAddress = async (address) => {
        const wallet = new WalletClass();
        const isValid = wallet.validateAddress(address)

        return isValid;
    }

    startLeasing = async () => {
        let err = 0;
        let message = '';

        if (!this.state.toAddress) {
            err++;
            message = 'Invalid address';
            return this.showError(message);
        }

        if (this.state.amount < 1) {
            err++;
            message = 'Invalid LNS amount';
        }

        if (this.state.amount > this.props.balance.LNS.total_amount) {
            err++;
            message = 'Insufficient funds';
        }

        const isValidAddress = await this.validateAddress(this.state.toAddress);

        if (!isValidAddress) {
            err++;
            message = 'Invalid address';
        }

        if (err > 0) {
            return this.showError(message);
        }

        this.setState({ ...this.state, buttonState: false });

        const leaseData = {
            toAddress: this.state.toAddress.trim(),
            amount: this.state.amount,
            fee: "100000",
            testnet: TESTNET
        };

        this.props.setLeasingAmount({
            toAddress: this.state.toAddress.trim(),
            amount: this.state.amount
        });

        const leasing = new LeasingClass();
        leasing.startLease(leaseData)
            .then(res => {
                if (res.code) {
                    throw res;
                }

                return this.showSuccess();
            }).catch(err => {
                this.showError();
                return console.error(err)
            });
    }

    // Chama o envento da modal
    handleModal = () => {
        let modalClass = document.querySelector(".modal-status");
        this.resetStateClose();
        return modalClass.style.display = "none";
    }

    toggleConfirmModal = () => {
        this.setState(prevState => ({
            openConfirmModal: !prevState.openConfirmModal
        }));
    }

    // Atualiza o valor de acordo com percentual informado
    leasingPercentCalculator = value => {
        this.setState({
            amount: (this.props.balance.LNS.total_confirmed * value) / 100
        });
    }

    // Atualiza o valor percentual
    setInputValue = value => {
        this.setState({
            amount: value
        });
    }

    // Atualiza o valor do endereço de envio
    setInputToAddress = value => {
        this.setState({
            toAddress: value,
        });
    }

    showError = (message) => {
        this.setState({
            message: message
        });

        const textMessage = document.querySelector('.show-message');
        textMessage.style.visibility = 'visible';
        textMessage.style.color = '#FF1C38';

        setTimeout(() => {
            textMessage.style.visibility = 'hidden';
        }, 3000);
    }

    showSuccess = () => {
        this.setState({
            message: 'Success!'
        });

        const textMessage = document.querySelector('.show-message');
        textMessage.style.visibility = 'visible';
        textMessage.style.color = '#4CD566';

        setTimeout(() => {
            textMessage.style.visibility = 'hidden';
            this.handleModal();
        }, 3000);
    }

    render() {
        return (
            <div>
                <Background className={"modal-status"}>
                    <LeasingStyleModalCss>
                        <Col defaultAlign={"center"} s={12} m={12} l={12}>
                            <Row>
                                <Close onClick={this.handleModal}>x</Close>

                                <Image src="/img/coins/lns.svg" />
                                <CoinValue offSide>{numeral(this.props.balance.LNS.total_confirmed).format('0,0.00000000')}</CoinValue>

                                <Rectangle>
                                    <Row>
                                        <div>
                                            <TextCenter clWhite>Amount</TextCenter>
                                        </div>
                                    </Row>
                                    <Row>
                                        <QuantityAmount clNormalGreen>
                                            <InputText
                                                type={'number'}
                                                onChange={(value) => this.setInputValue(value.target.value)}
                                                noBorder
                                                txCenter
                                                clNormalGreen
                                                placeholder={'0'}
                                                value={this.state.amount}
                                                min="0" />
                                        </QuantityAmount>
                                    </Row>
                                </Rectangle>
                            </Row>

                            <Row>
                                <DivNumber>
                                    <NumberPorcent marginRight={"35%"} clNormalGreen onClick={() => this.leasingPercentCalculator(25)}> 25%</NumberPorcent>
                                    <NumberPorcent marginRight={"27%"} clMostard onClick={() => this.leasingPercentCalculator(50)}>50%</NumberPorcent>
                                    <NumberPorcent clNormalRed onClick={() => this.leasingPercentCalculator(100)}>100%</NumberPorcent>
                                    <Line />
                                </DivNumber>
                            </Row>
                            <Row>
                                <DivText>
                                    <TextLeft clWhite>Mining node address</TextLeft>
                                    <Textphrase>
                                        <InputText
                                            onChange={(value) => this.setInputToAddress(value.target.value)}
                                            clWhite
                                            noBorder
                                            txCenter
                                            value={this.state.toAddress}
                                            placeholder={'Mining node address'} />
                                    </Textphrase>
                                    <LineText />
                                </DivText>
                            </Row>

                            <Row>
                                <DivText inline>
                                    <TextLeft clWhite>Fee
                                    <TextFee>0.001</TextFee>
                                    </TextLeft>

                                    <LineText />
                                </DivText>
                            </Row>
                            <Row>
                                <DivButton>
                                    <Message className="show-message" size={'1.4rem'} txCenter margin={'-1rem 0 1rem 0'}>{this.state.message}</Message>
                                    <ButtonGreen onClick={this.state.buttonState ? this.startLeasing : () => { }}>START LEASING</ButtonGreen>
                                </DivButton>
                            </Row>
                        </Col>
                    </LeasingStyleModalCss>
                </Background>
                {/* <ModalConfirm isOpen={this.state.openConfirmModal} onClose={this.toggleConfirmModal} amount={this.state.amount} /> */}
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        balance: state.balance,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setLeasingAmount: data => {
            dispatch(setLeasingAmount(data));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeasingModal);
