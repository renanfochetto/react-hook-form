import {
  Button, ErrorMessage,
  Fieldset,
  Form,
  FormContainer,
  Input,
  Label,
  Titulo,
} from "../../components";
import {useForm} from "react-hook-form";

interface FormInputEndereco {
  cep: string,
  rua: string,
  numero: string,
  bairro: string,
  localidade: string
}

const CadastroEndereco = () => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: {errors}
  } = useForm<FormInputEndereco>({
    mode: "all",
    defaultValues: {
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      localidade: ''
    }
  });

  const aoSubmeter = (dados: FormInputEndereco) => {
    console.log(dados);
  };

  const cepDigitado = watch('cep');

  const fetchEndereco = async (cep: string) => {
    if(!cep) {
      setError('cep', {
        type: 'manual',
        message: 'Campo de CEP é obrigatório'
      });
      return
    }
    try {
      const response = await fetch(`http://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (response.ok) {
        setValue('rua', data.logradouro);
        setValue('localidade', `${data.localidade}, ${data.uf}`);
        setValue('bairro', data.bairro);
      } else {
        throw new Error('CEP Inválido');
      }

      console.log(data)
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <>
      <Titulo>Agora, mais alguns dados sobre você:</Titulo>
      <Form onSubmit={handleSubmit(aoSubmeter)}>
        <Fieldset>
          <Label htmlFor="campo-cep">CEP</Label>
          <Input
            id="campo-cep"
            placeholder="Insira seu CEP"
            type="text"
            {...register('cep', {required: 'O Campo é obrigatório'})}
            $error={!!errors.cep}
            onBlur={() => fetchEndereco(cepDigitado)}
          />
          {errors.cep && <ErrorMessage>{errors.cep.message}</ErrorMessage>}
        </Fieldset>
        <Fieldset>
          <Label htmlFor="campo-rua">Rua</Label>
          <Input
            id="campo-rua"
            placeholder="Rua Agarikov"
            type="text"
            $error={!!errors.rua}
            {...register('rua', {required: 'O Campo é obrigatório'})}
          />
          {errors.rua && <ErrorMessage>{errors.rua.message}</ErrorMessage>}
        </Fieldset>

        <FormContainer>
          <Fieldset>
            <Label htmlFor="campo-numero-rua">Número</Label>
            <Input
              id="campo-numero-rua"
              placeholder="Ex: 1440"
              type="text"
              $error={!!errors.numero}
              {...register('numero', {required: 'O Campo é obrigatório'})}
            />
            {errors.numero && <ErrorMessage>{errors.numero.message}</ErrorMessage>}
          </Fieldset>
          <Fieldset>
            <Label htmlFor="campo-bairro">Bairro</Label>
            <Input
              id="campo-bairro"
              placeholder="Vila Mariana"
              type="text"
              $error={!!errors.bairro}
              {...register('bairro', {required: 'O Campo é obrigatório'})}
            />
            {errors.bairro && <ErrorMessage>{errors.bairro.message}</ErrorMessage>}
          </Fieldset>
        </FormContainer>
        <Fieldset>
          <Label htmlFor="campo-localidade">Localidade</Label>
          <Input
            id="campo-localidade"
            placeholder="São Paulo, SP"
            type="text"
            $error={!!errors.localidade}
            {...register('localidade', {required: 'O Campo é obrigatório'})}
          />
          {errors.localidade && <ErrorMessage>{errors.localidade.message}</ErrorMessage>}
        </Fieldset>
        <Button type="submit">Cadastrar</Button>
      </Form>
    </>
  );
};

export default CadastroEndereco;
