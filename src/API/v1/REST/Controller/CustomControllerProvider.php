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

        $ctrl->get('/{custom_id}', function ($custom_id) use ($app) {
            $param = array((int)$custom_id, false);
            $sql = 'call custom_get_item(?, ?)';
            $post = $app['db']->fetchAll($sql, $param);
            header('Content-Type: application/json');
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        //return $app['util']->stmtToArray($app, $stmt, 200, 400);

        return $ctrl;
    }
}