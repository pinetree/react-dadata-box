# React Dadata

React компонент для подсказок с помощью сервиса DaData.ru

Поддерживаются подсказки адресов, организаций, банков.

### Установка

```
npm install react-dadata-box
```

или

```
yarn react-dadata-box
```

### Пример

```javascript
import ReactDadataBox from 'react-dadata-box';

// ...

<ReactDadataBox token="API_KEY" query="Москва" />;
```

### Свойства

| Свойство         | Обязательный | Тип                                                | Описание                                                                                                                                                                                                 |
| ---------------- | ------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| token            | Да           | string                                             | Авторизационный токен DaData.ru                                                                                                                                                                          |
| type             | Нет          | string                                             | Тип данных, которые необходимо запросить: адрес(address), организация(party) или банк(bank), почта(email), фио(fio)                                                                                      |
| placeholder      | Нет          | string                                             | Текст placeholder                                                                                                                                                                                        |
| query            | Нет          | string                                             | Начальное значение поля ввода                                                                        
| constraints      | Нет          | object                                             | Объект, который может содержать locations, from_bound, to_bound. См. https://confluence.hflabs.ru/pages/viewpage.action?pageId=204669108   |                                                                                                    |
| onChange         | Нет          | function(suggestion: ReactDadata.DadataSuggestion) | Функция, вызываемая при выборе подсказки                                                                                                                                                                 |
| autocomplete     | Нет          | string                                             | Параметр описывающий автозаполнение поля, например street-address, если не задан, будет установлен как off                                                                                               |
| count            | Нет          | string                                             | Кол-во возвращаемых записей, по умолчанию 10                                                                                                                                                             |
| className        | Нет          | string                                             | Дополнительный класс стилей                                                                                                                                                                              |
| allowClear       | Нет          | boolean                                            | Показывать иконку для очищения текущего значения, по-умолчанию false                                                                                                                                     |
| dataExtract      | Нет          | string or function(suggestion: Object)             | Вернуть в качестве параметра `value` в ответе определенное поле из ReactDadata.DadataSuggestion.data. В параметрах - имя поля из data или функция принимающая data из ответа dadata в качестве параметра |
| clearOnBlur      | Нет          | boolean                                            | Очищать поле при потере фокуса, в случае если не выбрали вариант. По-умолчачнию `false`                                                                                                                  |
| allowCustomValue | Нет          | boolean                                            | Разрешить пользовательский ввод в поле. Если `true`, то контрол может работать как простой input.
| filter | Нет          | function(suggestions: Array)                                            | Callback принимающий массив результатов и фильтрующий их по правилам описанным в самой коллбек-функции
                                                                                               |
