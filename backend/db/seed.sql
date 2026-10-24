INSERT INTO transactions (
    id,
    user_id,
    type,
    from_account_id,
    to_account_id,
    category,
    amount,
    note,
    transaction_date
)
VALUES

-- Income: salary received into Working Account
(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '11111111-1111-4111-8111-111111111111',
    'income',
    NULL,
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    NULL,
    80000,
    'Part-time salary',
    CURRENT_DATE - 20
),

-- Transfer: Working Account -> Daily Expenses
(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '11111111-1111-4111-8111-111111111111',
    'transfer',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    NULL,
    15000,
    'Monthly spending money',
    CURRENT_DATE - 19
),

-- Transfer: Working Account -> Emergency Account
(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
    '11111111-1111-4111-8111-111111111111',
    'transfer',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    NULL,
    10000,
    'Emergency savings',
    CURRENT_DATE - 18
),

-- Expenses
(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4',
    '11111111-1111-4111-8111-111111111111',
    'expense',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    NULL,
    'food',
    1200,
    'Lunch',
    CURRENT_DATE - 2
),
(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb5',
    '11111111-1111-4111-8111-111111111111',
    'expense',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    NULL,
    'transport',
    600,
    'Train fare',
    CURRENT_DATE - 3
),
(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb6',
    '11111111-1111-4111-8111-111111111111',
    'expense',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    NULL,
    'entertainment',
    2500,
    'Movie',
    CURRENT_DATE - 4
),
(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb7',
    '11111111-1111-4111-8111-111111111111',
    'expense',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    NULL,
    'food',
    900,
    'Dinner',
    CURRENT_DATE - 1
),
(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb8',
    '11111111-1111-4111-8111-111111111111',
    'expense',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    NULL,
    'education',
    1800,
    'Textbook',
    CURRENT_DATE - 6
),

-- Previous month expense
(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb9',
    '11111111-1111-4111-8111-111111111111',
    'expense',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    NULL,
    'shopping',
    4000,
    'Clothes',
    (date_trunc('month', CURRENT_DATE) - INTERVAL '5 days')::date
)
ON CONFLICT (id) DO NOTHING;