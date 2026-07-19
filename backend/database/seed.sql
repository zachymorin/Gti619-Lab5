INSERT OR IGNORE INTO security_config (key, value) VALUES 
('max_attempts', '3'),
('min_length', '8'),
('password_history_limit', '3');

INSERT OR IGNORE INTO clients (id, name, type) VALUES 
(1, 'Jean-Marc Robert', 'residentiel'),
(2, 'Mathias St-Jean', 'residentiel'),
(3, 'Entreprises Montréal inc.', 'affaire'),
(4, 'Technologies ÉTS', 'affaire');

-- Note : Ces mots de passe correspondent à "admin1", "user1", "user2"
-- hachés avec le sel indiqué ci-dessous (PBKDF2-SHA512, 100000 itérations).
INSERT OR IGNORE INTO users (id, username, password_hash, salt, roleId) VALUES 
(
  1, 
  'Admin', 
  '52c2411b51a1847eacd079dc756a4796b98863f4adba199655430c63f9816013c46a9843d54b797d6400f488f976fc9db14e3bebb77a550699fa1f4017a07c36', 
  '9b5c9c0bfa86addb5f8db782f89e46ec', 
  1
),
(
  2, 
  'User1', 
  '7a6f9a3d51d0fcef66d336591622433c05fda8a1b07b6fa22be660608876079f7a0cf9136a20cd558813bed4cba096d13f5482c4a54498a82120afe2f0e3bb56', 
  'c494b03a9b25bf47552f0690a58c0b15', 
  2
),
(
  3, 
  'User2', 
  'c6c0768fd25d0398bb20fdabbb7684cf425a9ae98fbd8cef8a9057554c69cd74b1c0d8c6992b8689a0960f84cd2dd29981ac69f62b41c8c8fba2edcece07d149', 
  '6b651e89317292857ac1a729eff34b45', 
  3
);