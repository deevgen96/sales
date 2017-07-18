<?php
/**
 * Created by PhpStorm.
 * User: 111
 * Date: 10.07.2017
 * Time: 21:32
 */

namespace API\v1\REST\Controller;


use Silex\Api\ControllerProviderInterface;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class CustomControllerProvider implements ControllerProviderInterface
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
            $sql = 'call custom_get()';
            $post = $app['db']->fetchAll($sql, $param);
            header('Content-Type: application/json');
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        $ctrl->post('/{source_id}', function (Request $request, $source_id) use ($app) {
            $custom = $request->request->all();
            $param = array($source_id, $custom['custom_id'], $custom['custom_numb'], $custom['custom_name'], $custom['send_date'], $custom['delivery_date']);
            $sql = 'call custom_set(?,?,?,?,?,?)';
            $post = $app['db']->fetchAll($sql, $param);
            header('Content-Type: application/json');
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        $ctrl->delete('/{custom_id}', function ($custom_id) use ($app) {
            $param = array((int)$custom_id);
            $sql = 'call custom_remove()';
            $post = $app['db']->fetchAll($sql, $param);
            header('Content-Type: application/json');
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        $ctrl->get('/{custom_id}/item', function ($custom_id) use ($app) {
            $param = array((int)$custom_id, false);
            $sql = 'call custom_get_item(?, ?)';
            $post = $app['db']->fetchAll($sql, $param);
            header('Content-Type: application/json');
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });



        return $ctrl;
    }
}