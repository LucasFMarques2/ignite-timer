import styled, {css} from "styled-components";

export type buttonVariant = "primary" | "secondary" | "success" | "danger";

interface ButtonContainerProps {
    variant: buttonVariant
}

const buttonVariantes = {
    primary: 'purple',
    secondary: 'orange',
    success: 'green',
    danger: 'red'
}

export const ButtonContainer= styled.button<ButtonContainerProps>`
    width: 200px;
    height: 50px;
    border: none;
    color: white;
    border-radius: 10px;

    ${props => {
       return css`
       background-color: ${buttonVariantes[props.variant]};
       `
    }}
`