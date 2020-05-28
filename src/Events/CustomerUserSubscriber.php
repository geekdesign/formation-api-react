<?php

namespace App\Events;


use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class CustomerUserSubscriber implements EventSubscriberInterface
{

    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents() 
    {
        return [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCustomer(ViewEvent $event)
    {
        $customer = $event->getControllerResult(); //On récupére le context ou on se trouve
        $method = $event->getRequest()->getMethod(); //on récupère la méthode utilisée pour faire un contrôle

        
        //On controle qu'on se trouve bien dans la bonne entité est qu'on se trouve avant la validation et que la méthode utilisée est bien la méthode post
        if ($customer instanceof Customer && $method === 'POST')
        {
            //On récupérer l'utilisateur connecté actuellement
            $user = $this->security->getUser();
            //On assigne l'utilisateur au Customer que l'on est entrain de créer
            $customer->setUser($user);
        }
    }



}