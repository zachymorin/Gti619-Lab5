INSERT OR IGNORE INTO security_config (key, value) VALUES 
('max_attempts', '3'),
('min_length', '8'),
('password_history_limit', '3');

INSERT OR IGNORE INTO clients (id, name, type) VALUES 
(1, 'Jean-Marc Robert', 'residentiel'),
(2, 'Mathias St-Jean', 'residentiel'),
(3, 'Entreprises Montréal inc.', 'affaire'),
(4, 'Technologies ÉTS', 'affaire');

-- Note : Ces mots de passe correspondent à "Admin123!", "Res1234!", "Bus1234!"
-- hachés avec le sel indiqué ci-dessous (PBKDF2-SHA512, 100000 itérations).
INSERT OR IGNORE INTO users (id, username, password_hash, salt, role) VALUES 
(
  1, 
  'Administrateur', 
  '7fa8fa782b5fa489db7ff910cbfbdfb5df498ec561cdcd4f6d0f5e7146e2a220551065bd5c8f8d697843d1a89c62985fd250877bd36f56860d5b6e2d9370fa99', 
  '8ab4f877d9c104e1e828d1544a0eef9f', 
  'Administrateur'
),
(
  2, 
  'Utilisateur1', 
  '2f3cd2b083b46944b20fc6de4279782bcf2b260fa1f92e34274c5d8ba15f9ff22880c10bcf2e26fd8457c3e1dbf37b9eeffcd623de4b9a0de248b11fbcd9208f', 
  '9ecbf20a3219ee94ab92d4ef0a320391', 
  'Préposé aux clients résidentiels'
),
(
  3, 
  'Utilisateur2', 
  '120c8debf7d4bfa58a43f9cd781efbc95837ff290fcb34cd0f9a2b8ef902b9cdffce640b92ee3cde91ea3bfe7df219ffecdf908de802b9abdec0e51eecc39aef', 
  '1cb9e90a5528aa0de34bb883bbf590a3', 
  'Préposé aux clients d''affaire'
);