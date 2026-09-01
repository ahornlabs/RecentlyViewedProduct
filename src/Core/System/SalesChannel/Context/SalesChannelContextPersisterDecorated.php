<?php declare(strict_types=1);

namespace RecentlyViewedProduct\Core\System\SalesChannel\Context;

use Doctrine\DBAL\Connection;
use Psr\Clock\ClockInterface;
use Shopware\Core\Checkout\Cart\CartPersister;
use Shopware\Core\System\SalesChannel\Context\SalesChannelContextPersister;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class SalesChannelContextPersisterDecorated extends SalesChannelContextPersister
{
    public function __construct(
        private readonly SalesChannelContextPersister $decorated,
        private readonly Connection $connection,
        EventDispatcherInterface $eventDispatcher,
        CartPersister $cartPersister,
        ClockInterface $clock,
        ?string $lifetimeInterval = 'P1D'
    ) {
        parent::__construct($this->connection, $eventDispatcher, $cartPersister, $clock, $lifetimeInterval);
    }

    public function replace(string $oldToken, SalesChannelContext $context): string
    {
        $newToken = $this->decorated->replace($oldToken, $context);

        $this->connection->executeStatement(
            'UPDATE `recently_viewed_product`
                   SET `token` = :newToken
                   WHERE `token` = :oldToken',
            [
                'newToken' => $newToken,
                'oldToken' => $oldToken,
            ]
        );

        return $newToken;
    }

    public function delete(string $token, ?string $salesChannelId = null, ?string $customerId = null): void
    {
        $this->decorated->delete($token, $salesChannelId, $customerId);

        $this->connection->executeStatement(
            'DELETE FROM recently_viewed_product WHERE token = :token',
            [
                'token' => $token,
            ]
        );
    }
}
