import './q.sass';
import React, { useState } from 'react';

function App() {
  const options = window.quizOptions;
  const [step, setStep] = useState(1);
  const [result, setResult] = useState([]);
  const length = options.steps.length;

  const setStepWrapper = (action) => {
    let newStep = step;
    let length = options.steps.length;
    if (action === 'prev') {
      newStep = step - 1
    }
    else {
      newStep = step + 1
    }
    setStep(newStep >= 1 && newStep <= length ? newStep : step)
  }

  const sendForm = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let html = [];
    for (let [name, value] of formData) {
      html.push([name,value]);
    }
    setResult(html);
  }

  return (
    <>
      <h1>Образец формы опроса (квиза)</h1>
      <ul>
        <li>Настраивается под любой сайт и любые нужды</li>
        <li>Может быть интегрирован на любой сайт</li>
        <li>Серверная часть для обработки и отправки сообщений добавляется отдельно</li>
      </ul>
      
      <div id="q">
        <form id="q-form" onSubmit={sendForm}>
          
          <div className="q__header">Шаг {step} из {length}</div>
          
          <Parts o={options} ind={step - 1} />
        
          <div className="q__footer">
            <div onClick={() => setStepWrapper('prev')} className="q-btn">Назад</div>

            { step !== length ?
                <Btn text="Далее" action={() => setStepWrapper('next')} />
              :
                <button className="q-btn" type="submit">Отправить</button>
            }
          </div>
        </form>
        <Result a={result} />
      </div>
    </>
  );
}

export default App;

function Btn(props) {
  const {text, action} = { ...props };

  return <div onClick={action} className="q-btn">{text}</div>
}

function Result(props) {
  const html = props.a.map((e, i) => {
    return (
      <li>{e[0]} = { e[1] }</li>
    )
  })
  return (
    <div className="q__result">
      <p>Выходные данные формы</p>
      <ul className="q__result-list">{html}</ul>
    </div>
  )
}

function Parts(props) {
  const options = props.o;
  const html = options.steps.map((s, i) => {
    const open = props.ind === i ? 'open' : '';
    return (
      <Step key={`step_${i}`} s={s} open={open} />
    )
  })

  return html;
}

function Step(props) {
  const s = props.s;
  return (
    <div className={`q__step-content ${props.open}`}>
      <p className="q__question">{s.question}</p>
      <div className="q__variants">
        <Variants s={s} />
      </div>
    </div>
  );
}

function Variants(props) {
  const type = props.s.fieldType;
  if (type === 'radio') {
    return <RadioFields s={props.s} />
  }
  else if (type === 'submit') {
    return <SubmitFields {...props} />
  }
  return('Неизвестный тип поля')
}

function RadioFields(props) {
  const fields = props.s.variants.map((f, i) => {
    return <RadioField key={`field_${i}`} f={f} fieldName={props.s.fieldName} />
  });

  return fields;
}

function RadioField(props) {
  const o = props.f
  const value = o.value ? o.value : o.answer;
  return (
    <FormControl label={o.answer}>
      <input type="radio" name={props.fieldName} value={value} />
    </FormControl>
  )
}

function SubmitFields(props) {
  if (props.s.fields.length > 0) {
    const html = props.s.fields.map((f, i) => {
      return (
        <FormControl
          key={`fc_${i}`}
          label={f.label}
          name={f.fieldName}
          req={f.required}
          type="text"
        />
      )
    })
    return html;
  }
  else {
    return 'None fields';
  }
}

function FormControl(props) {
  const { label, name, req, type } = { ...props };
  if (type === 'text') {
    return (
      <label className="text-field">
        <span>{label}</span>
        <input type={type} name={name} required={req} />
      </label>
      
    )
  }
  else {
    return (
      <label>
        {props.children}
        <span>{props.label}</span>
      </label>
    )
  }
}