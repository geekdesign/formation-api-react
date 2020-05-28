<?php

namespace App\Events;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repos)
    {
        $this->security = $security;
        $this->repository = $repos;
    }


    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event)
    {
        $invoice = $event->getControllerResult(); //On récupére le context ou on se trouve
        $method = $event->getRequest()->getMethod(); //on récupère la méthode utilisée pour faire un contrôle
        
        if ($invoice instanceof Invoice && $method === 'POST')
        {
            $nextChrono = $this->repository->findNextChrono($this->security->getUser());
            $invoice->setChrono($nextChrono);

            if(empty($invoice->getSentAt()))
            {
                $invoice->setSentAt(new \DateTime());
            }

        }
        

    }

}