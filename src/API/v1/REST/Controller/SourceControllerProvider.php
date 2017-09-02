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

class SourceControllerProvider implements ControllerProviderInterface
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

        $ctrl->post('/', function (Request $request) use ($app) {
            $source = $request->request->all();
            $params = array($source['source_id'], $source['source_name'], $source['source_url'], $source['image_folder']);
            $sql = 'call source_set(?, ?, ?, ?)';
            $post = $app['db']->fetchAll($sql, $params);
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        $ctrl->delete('/{source_id}/', function ($source_id) use ($app) {
            $params = array((int)$source_id);
            $sql = 'call source_remove(?)';
            $post = $app['db']->fetchAll($sql, $params);
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });
        //return $app['util']->stmtToArray($app, $stmt, 200, 400);

        $ctrl->post('/custom/{custom_id}/item/', function (Request $request, $custom_id) use ($app) {
            $custom_item = $request->request->all();
            $params = array($custom_item['log_id'], $custom_item['client_id'], $custom_id
            , $custom_item['item_id'], $custom_item['article'], $custom_item['item_link']
            , $custom_item['item_size'], $custom_item['item_count'], $custom_item['item_photo'], $custom_item['sex']
            , $custom_item['source_price'], $custom_item['sale_price'], $custom_item['decline_before_send'], $custom_item['decline_after_sale']);
            $sql = 'call custom_set_item(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            $post = $app['db']->fetchAll($sql, $params);
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        $ctrl->delete('/custom/{custom_id}/item/{log_id}/delete/', function ($custom_id, $log_id) use ($app) {
            $param = array((int)$log_id);
            $sql = 'call custom_remove_item(?)';
            $post = $app['db']->fetchAll($sql, $param);
            header('Content-Type: application/json');
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });
        //return $app['util']->stmtToArray($app, $stmt, 200, 400);

        $ctrl->post('/{source_id}/custom/post/', function (Request $request, $source_id) use ($app) {
            $custom = $request->request->all();
            $params = array($source_id, $custom['custom_id'], $custom['custom_numb'], $custom['custom_name'], $custom['send_date'], $custom['delivery_date']);
            $sql = 'call custom_set(?, ?, ?, ?, ?, ?)';
            $post = $app['db']->fetchAll($sql, $params);
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        $ctrl->delete('/{source_id}/custom/{custom_id}/delete/', function ($source_id, $custom_id) use ($app) {
            $params = array($custom_id);
            $sql = 'call custom_remove(?)';
            $post = $app['db']->fetchAll($sql, $params);
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        $ctrl->get('/{source_id}/custom/{custom_id}/payment/', function ($source_id, $custom_id) use ($app) {
            $param = array((int)$custom_id);
            $sql = 'call custom_get_payments(?)';
            $post = $app['db']->fetchAll($sql, $param);
            header('Content-Type: application/json');
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        $ctrl->post('/{source_id}/custom/{custom_id}/payment/', function (Request $request, $source_id, $custom_id) use ($app) {
            $payment = $request->request->all();
            $param = array($payment['payment_id'], (int)$payment['client_id'], (int)$payment['custom_id'], $payment['payment_date'], $payment['payment_sum']);
            $sql = 'call custom_set_payment(?, ?, ?, ?, ?)';
            $post = $app['db']->fetchAll($sql, $param);
            header('Content-Type: application/json');
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        $ctrl->delete('/custom/{custom_id}/payment/{payment_id}/delete', function ($custom_id, $payment_id) use ($app) {
            $param = array((int)$custom_id, (int)$payment_id);
            $sql = 'call custom_remove_payment(?,?)';
            $post = $app['db']->fetchAll($sql, $param);
            header('Content-Type: application/json');
            return new Response(json_encode($post), 200, ['Content-Type' => 'application/json']);
        });

        return $ctrl;
    }
}
