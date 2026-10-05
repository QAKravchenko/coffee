import { test, expect } from '@playwright/test';

/**
 * Функція, яка приймає вік користувача та повертає повідомлення щодо права голосу.
 * @param {number} age - Вік користувача (невід'ємне ціле число)
 * @returns {string} Рядок з результатом
 */
function getVotingMessage(age) {
  // Валідація некоректних даних
  if (
    typeof age !== 'number' ||
    Number.isNaN(age) ||
    !Number.isFinite(age) ||
    !Number.isInteger(age) ||
    age < 0
  ) {
    throw new Error('Некоректний вік: вік має бути невід\'ємним цілим числом');
  }

  // Розгалуження if / else
  if (age >= 18) {
    return 'Ви можете голосувати.';
  } else {
    return 'Ви ще не можете голосувати.';
  }
}

test.describe('Перевірка віку для голосування — getVotingMessage(age)', () => {

  // Обов'язкова перевірка трьох граничних значень (Boundary Value Analysis)
  test.describe('Граничні значення (17, 18, 19)', () => {
    test('17 років — значення перед порогом повертає "Ви ще не можете голосувати."', () => {
      const result = getVotingMessage(17);
      expect(result).toBe('Ви ще не можете голосувати.');
    });

    test('18 років — сам поріг повертає "Ви можете голосувати."', () => {
      const result = getVotingMessage(18);
      expect(result).toBe('Ви можете голосувати.');
    });

    test('19 років — значення після порога повертає "Ви можете голосувати."', () => {
      const result = getVotingMessage(19);
      expect(result).toBe('Ви можете голосувати.');
    });
  });

  // Класи еквівалентності (Equivalence Partitioning)
  test.describe('Класи еквівалентності (< 18 та >= 18)', () => {
    test('користувачі молодші за 18 років (значення всередині класу: 10 років)', () => {
      const result = getVotingMessage(10);
      expect(result).toBe('Ви ще не можете голосувати.');
    });

    test('користувачі віком від 18 років включно (значення всередині класу: 30 років)', () => {
      const result = getVotingMessage(30);
      expect(result).toBe('Ви можете голосувати.');
    });

    test('користувачі віком 25 років - повертає "Ви можете голосувати."', () => {
      const result = getVotingMessage(25);
      expect(result).toBe('Ви можете голосувати.');
    });
  });

  // Додаткова частина: валідація некоректного віку
  test.describe('Валідація некоректного віку (додатково)', () => {
    test('від\'ємне число (-1) спричиняє помилку', () => {
      expect(() => getVotingMessage(-1)).toThrow('Некоректний вік: вік має бути невід\'ємним цілим числом');
    });

    test('дробове число (17.5) спричиняє помилку', () => {
      expect(() => getVotingMessage(17.5)).toThrow('Некоректний вік: вік має бути невід\'ємним цілим числом');
    });

    test('рядок замість числа ("18") спричиняє помилку', () => {
      expect(() => getVotingMessage('18')).toThrow('Некоректний вік: вік має бути невід\'ємним цілим числом');
    });

    test('NaN спричиняє помилку', () => {
      expect(() => getVotingMessage(NaN)).toThrow('Некоректний вік: вік має бути невід\'ємним цілим числом');
    });

    test('нескінченність (Infinity) спричиняє помилку', () => {
      expect(() => getVotingMessage(Infinity)).toThrow('Некоректний вік: вік має бути невід\'ємним цілим числом');
    });
  });
});

export { getVotingMessage };
