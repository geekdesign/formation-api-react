<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AppController extends AbstractController
{
    /**
     * @Route("/", name="app")
     */
    public function index()
    {
        return $this->render('app/index.html.twig', []);
    }
}
