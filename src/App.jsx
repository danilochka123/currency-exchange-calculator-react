import React, { useState, useEffect } from "react";
import "./index.css";

//Rus

//БЕЗ ПОДСКАЗОК:
//Создайте интерфейс для конвертации валют с загрузкой данных валют из API Frankfurter в state, динамическим отображением options в select, обработкой выбранных валют, ввода суммы, расчётом конвертации через асинхронную функцию с try/catch/finally, отображением результата в UI, проверкой, что сумма больше 0, и состояниями для загрузки и ошибок.

//C ПОДСКАЗКАМИ:
/*
// [x] 1 - Получите массив всех валют из API Frankfurter и запишите его в state.
// [x] 2 - Используя map, динамически создайте options внутри select.
// [x] 3 - Получите значения выбранных валют из обоих select и запишите их в state fromCurrency и toCurrency.
// [x] 4 - Создайте state для записи amount из input. Запишите данные из input в этот state.
// [x] 5 - Создайте вторую асинхронную функцию для получения значения конвертации двух валют. Запишите результат конвертации в новый state - convertedAmount. Покажите результат в интерфейсе.
// [x] 6 - Добавьте в обе функции блоки try/catch/finally. Создайте state для loading (true/false) и error ("Сообщение ошибки").
// [x] 7 - Внедрите логику отображения загрузки и ошибок в интерфейсе.
// [] 8 - Добавьте проверку, чтобы amount был больше 0.
*/

//https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD

const API_URL = "https://api.frankfurter.app/";



function App() {
  const [currencies, setCurrencies] = useState([])
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [amount, setAmount] = useState('')
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    async function getCurrency() {
      try {
        const response = await fetch(`${API_URL}currencies`)

        if (!response.ok){
          throw new Error("ОШИБКА")
        }

        const currencyData = await response.json()
        const allCurency = Object.keys(currencyData)
        setCurrencies(allCurency)
      } catch(err){
        console.log(err)
      }
    }
    getCurrency()
  }, []);

  async function handleConvert() {
    try {
      setLoading(true)
      setConvertedAmount(null)
      if (amount <= 0) throw setError('Please enter a number greater than 0')
      const response = await fetch(`${API_URL}latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
      const currencyData = await response.json()

      if (currencyData.error){
        setError('Failed to convert')
        return
      }

      const getConvert = currencyData.rates[toCurrency].toFixed(2)
      setConvertedAmount(getConvert)
      setError(null)
    } catch (err){
      setError(err.message)
      setConvertedAmount(null)
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="app">
      <h1>Currency Exchange Calculator</h1>

      <div className="converter-container">
        {error && <p className='error'>{error}</p>}

        <div className="input-group">
          <input
            type="number"
            placeholder="Amount"
            className="input-field"
            min={0}
            value={amount}
            onChange={(event) => (
              setAmount(event.target.value > -1 ? event.target.value : 1))}
          />

          <select
            className="dropdown"
            value={fromCurrency}
            onChange={(event) => setFromCurrency(event.target.value)}
          >
            {currencies.map((currency, index) => (
              <option key={index}>{currency}</option>
            ))}
          </select>

          <span className="arrow">→</span>

          <select
            className="dropdown"
            value={toCurrency}
            onChange={(event) => setToCurrency(event.target.value)}
          >
            {currencies.map((currency, index) => (
              <option key={index}>{currency}</option>
            ))}
          </select>
        </div>
        <button className="convert-button" onClick={handleConvert}>Convert</button>
        {loading && <p className="loading">Converting...</p>}
        {convertedAmount && !error && <p className="result">{convertedAmount}</p>}
      </div>
    </div>
  );
}

export default App;
