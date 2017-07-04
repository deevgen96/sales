<?php
/**
 * Created by PhpStorm.
 * User: 111
 * Date: 04.07.2017
 * Time: 22:22
 */

namespace sales\Controller;

use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class SalesControllerProvider implements ControllerProviderInterface {
    public function connect (Application $app){
        $ctrl = $app['controllers_factory'];
        // Разбор JSON
        $ctrl->before(function (Request $request) use ($app) {
            if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
                $data = json_decode($request->getContent(), true);
                $request->request->replace(is_array($data) ? $data : array());
            }
        });

        $ctrl->get('/', function () use ($app) {

            return $app['twig']->render('sales.html.twig');

        });

        //return $app['util']->stmtToArray($app, $stmt, 200, 400);

        return $ctrl;
    }
}