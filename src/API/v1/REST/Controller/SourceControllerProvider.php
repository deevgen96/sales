<?php
/**
 * Created by PhpStorm.
 * User: deevgen
 * Date: 03.07.2017
 * Time: 22:08
 */

namespace API\v1\REST\Controller;


use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class SourceControllerProvider implements ControllerProviderInterface {
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

            $sql = 'call source_get()';
            $post = $app['db']->fetchAll($sql);
            header('Content-Type: application/json');
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        $ctrl->get('/{source_id}/custom/', function ($source_id) use ($app) {
            $param = array((int)$source_id, false);
            $sql = 'call source_get_custom(?, ?)';
            $post = $app['db']->fetchAll($sql, $param);
            header('Content-Type: application/json');
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

            //return $app['util']->stmtToArray($app, $stmt, 200, 400);

        return $ctrl;
    }
}
