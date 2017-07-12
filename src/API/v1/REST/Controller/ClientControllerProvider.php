<?php
/**
 * Created by PhpStorm.
 * User: 111
 * Date: 11.07.2017
 * Time: 20:46
 */

namespace API\v1\REST\Controller;


use Silex\Api\ControllerProviderInterface;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class ClientControllerProvider implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $ctrl = $app['controllers_factory'];
        // Разбор JSON
        $ctrl->before(function (Request $request) use ($app) {
            if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
                $data = json_decode($request->getContent(), true);
                $request->request->replace(is_array($data) ? $data : array());
            }
        });

        $ctrl->get('/', function () use ($app) {
            $params = array((int)0);
            $sql = 'call client_get(?)';
            $post = $app['db']->fetchAll($sql, $params);
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        $ctrl->get('/{client_id}', function ($client_id) use ($app) {
            $params = array((int)$client_id);
            $sql = 'call client_get(?)';
            $post = $app['db']->fetchAll($sql, $params);
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        $ctrl->post('/', function (Request $request) use ($app) {
            $client = $request->request->all();
            $params = array($client['client_id'], $client['client_name'], $client['profile_link'], $client['region'], $client['client_honor'], $client['client_greeting']);
            $sql = 'call client_set(?, ?, ?, ?, ?, ?)';
            $post = $app['db']->fetchAll($sql, $params);
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        //return $app['util']->stmtToArray($app, $stmt, 200, 400);

        return $ctrl;
    }
}