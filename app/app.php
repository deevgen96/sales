<?php
/**
 * Created by PhpStorm.
 * User: 111
 * Date: 03.07.2017
 * Time: 22:19
 */

$loader = require_once __DIR__ . '/../vendor/autoload.php';

$loader->add('API', __DIR__ . '/../src' );
$loader->add('sales', __DIR__ . '/../src' );

$app = new Silex\Application();

$app['debug'] = true;

//Подключение к БД
$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
        'driver'    => 'pdo_mysql',
        'host'      => 'localhost',
        'dbname'    => 'sales',
        'user'      => 'root',
        'password'  => 'deevgen396207',
        'port'      => '3306',
    )
));

//Сервисы
$app->register(new Silex\Provider\TwigServiceProvider(),array(
    'twig.path' => __DIR__.'/views'
));

$app->register(new Silex\Provider\SessionServiceProvider());

$app->mount('api/v1/rest/source',new API\v1\REST\Controller\SourceControllerProvider());
$app->mount('api/v1/rest/custom',new API\v1\REST\Controller\CustomControllerProvider());
$app->mount('sales',new sales\Controller\SalesControllerProvider());
$app->run();