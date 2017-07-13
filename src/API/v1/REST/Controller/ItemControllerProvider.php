<?php
/**
 * Created by PhpStorm.
 * User: 111
 * Date: 13.07.2017
 * Time: 22:32
 */

namespace API\v1\REST\Controller;


use Silex\Api\ControllerProviderInterface;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class ItemControllerProvider implements ControllerProviderInterface
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
            $sql = 'call item_get()';
            $post = $app['db']->fetchAll($sql);
            header('Content-Type: application/json');
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        //return $app['util']->stmtToArray($app, $stmt, 200, 400);

        return $ctrl;
    }
}