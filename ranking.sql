-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Сен 16 2018 г., 13:32
-- Версия сервера: 5.6.37
-- Версия PHP: 7.0.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `ranking`
--

-- --------------------------------------------------------

--
-- Структура таблицы `ranking`
--

CREATE TABLE `ranking` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `score` int(11) NOT NULL,
  `time` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `ranking`
--

INSERT INTO `ranking` (`id`, `username`, `score`, `time`) VALUES
(20, 'fbbgfbgf', 13, '51'),
(21, 'Player1', 6, '25'),
(22, 'vdvfd', 0, '17'),
(23, 'gnhgn', 5, '25'),
(24, 'gnhgnf', 0, '20'),
(25, 'nhgfnhf', 0, '20'),
(26, 'gfbgd', 5, '38'),
(27, 'Roman', 5, '49'),
(28, 'bgfdbd', 2, '24'),
(29, 'bgfdbd', 2, '25'),
(30, 'bgfdbd', 2, '25'),
(31, 'bgfdbd', 2, '25'),
(32, 'bgfbg', 5, '28'),
(33, 'bnvnv', 5, '23'),
(34, 'gbgd', 18, '78'),
(35, 'gfbgf', 9, '40'),
(36, 'ngfnhgf', 0, '64'),
(37, 'hghfnhg', 0, '30');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `ranking`
--
ALTER TABLE `ranking`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `ranking`
--
ALTER TABLE `ranking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
