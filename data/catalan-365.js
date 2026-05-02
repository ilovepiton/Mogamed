const catalan365 = [
  {
    day: 1,
    words: [
      {
        word: "casa",
        translationRu: "дом",
        translationEn: "house",
        example: "Aquesta és la meva casa.",
        exampleRu: "Это мой дом.",
        type: "new"
      },
      {
        word: "aigua",
        translationRu: "вода",
        translationEn: "water",
        example: "Vull aigua.",
        exampleRu: "Я хочу воды.",
        type: "new"
      }
    ]
  },

  {
    day: 2,
    words: [
      {
        word: "gos",
        translationRu: "собака",
        translationEn: "dog",
        example: "El gos és gran.",
        exampleRu: "Собака большая.",
        type: "new"
      }
    ]
  }

  /*
    Дальше другой GPT должен продолжить по такой же структуре:

    {
      day: 3,
      words: [
        {
          word: "...",
          translationRu: "...",
          translationEn: "...",
          example: "...",
          exampleRu: "...",
          type: "new"
        }
      ]
    }

    Важно:
    - всего нужно 365 объектов day
    - в каждом day должно быть ровно 10 слов
    - первые 7 слов type: "new"
    - последние 3 слова type: "review"
    - после каждого day, кроме последнего, нужна запятая
  */
];
