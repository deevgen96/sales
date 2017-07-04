<?php
/**
 * Created by PhpStorm.
 * User: 111
 * Date: 03.07.2017
 * Time: 22:19
 */

$loader = require_once __DIR__ . '/../vendor/autoload.php';

$loader->add('API', __DIR__ . '/../src' );

$app = new Silex\Application();

$app['debug'] = true;

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
$app->register(new Silex\Provider\SessionServiceProvider());

$app->mount('api/v1/rest/source',new API\v1\REST\Controller\SourceControllerProvider());

$app->run();