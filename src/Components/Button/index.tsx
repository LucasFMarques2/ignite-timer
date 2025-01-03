import { ButtonContainer, buttonVariant } from "./index.styles";

interface ButtonProps {
    variant?: buttonVariant
}


export function Button({variant = 'primary'}: ButtonProps){
    return (
        <ButtonContainer variant={variant}>
            Enviar
        </ButtonContainer>
    )
}