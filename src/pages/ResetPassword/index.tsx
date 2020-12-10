import React, {
  useCallback,
  useRef,
} from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { UseAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  Content,
  Background,
  AnimationContainer,
} from './styles';

interface ResetPaswordFormData {
  email: string;
  password: string;
}

const ResetPasword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { singIn } = UseAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: ResetPaswordFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        password: Yup.string()
          .required('Senha obrigatório.'),
        password_confirmation: Yup.string().oneOf(
          [Yup.ref('password')],
          'Confirmação incorreta',
        ),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      history.push('/signin');

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao resetar senha',
        description: 'Ocorreu um erro ao resetar a sua senha, tente novamente.',
      });
    }
  }, [addToast, history]);
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Nova senha"
            />
            <Input
              icon={FiLock}
              name="password_confirmation"
              type="password"
              placeholder="Confirmação da senha"
            />
            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPasword;
