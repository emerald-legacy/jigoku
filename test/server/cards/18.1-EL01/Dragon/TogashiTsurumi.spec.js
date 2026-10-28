describe('Togashi Tsurumi', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-tsurumi'],
                    hand: ['hurricane-punch', 'iron-foundations-stance', 'kyofuki-s-hammer']
                },
                player2: {
                    inPlay: []
                }
            });

            this.tsurumi = this.player1.findCardByName('togashi-tsurumi');
            this.punch = this.player1.findCardByName('hurricane-punch');
            this.stance = this.player1.findCardByName('iron-foundations-stance');
            this.hammer = this.player1.findCardByName('kyofuki-s-hammer');
        });

        it('should put cards underneath self and get +1/+1 per card', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tsurumi],
                defenders: [],
                ring: 'water'
            });
            this.player2.pass();

            const fate = this.player1.fate;
            const mil = this.tsurumi.militarySkill;
            const pol = this.tsurumi.politicalSkill;
            const hand = this.player1.hand.length;

            this.player1.clickCard(this.tsurumi);
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.punch);
            expect(this.player1).toBeAbleToSelect(this.stance);
            expect(this.player1).toBeAbleToSelect(this.hammer);
            this.player1.clickCard(this.punch);
            expect(this.punch.isUnderneath(this.tsurumi)).toBe(true);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Togashi Tsurumi to place a card from their hand beneath Togashi Tsurumi and draw a card'
            );

            expect(this.player1.fate).toBe(fate);
            expect(this.tsurumi.militarySkill).toBe(mil + 1);
            expect(this.tsurumi.politicalSkill).toBe(pol + 1);
            expect(this.player1.hand.length).toBe(hand);
        });

        it('kihos cards underneath self should be playable', function () {
            const initialMIL = this.tsurumi.militarySkill;
            const initialPOL = this.tsurumi.politicalSkill;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tsurumi],
                defenders: [],
                ring: 'water'
            });
            this.player2.pass();

            expect(this.tsurumi.militarySkill).toBe(initialMIL);
            expect(this.tsurumi.politicalSkill).toBe(initialPOL);

            this.player1.clickCard(this.tsurumi);
            this.player1.clickCard(this.stance);

            expect(this.tsurumi.militarySkill).toBe(initialMIL + 1);
            expect(this.tsurumi.politicalSkill).toBe(initialPOL + 1);

            this.player2.pass();
            this.player1.clickCard(this.stance);
            this.player1.clickCard(this.tsurumi);
            this.player2.pass();

            expect(this.getChatLogs(5)).toContain(
                'player1 plays Iron Foundations Stance from their cards set aside by Togashi Tsurumi'
            );

            expect(this.stance.location).toBe('conflict discard pile');
            expect(this.tsurumi.militarySkill).toBe(initialMIL);
            expect(this.tsurumi.politicalSkill).toBe(initialPOL);
        });

        it('non kihos cards underneath self should not be playable', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tsurumi],
                defenders: [],
                ring: 'water'
            });
            this.player2.pass();

            this.player1.clickCard(this.tsurumi);
            this.player1.clickCard(this.hammer);
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.hammer);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});

describe('Togashi Tsurumi with an empty hand', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-tsurumi'],
                    hand: []
                }
            });
            this.tsurumi = this.player1.findCardByName('togashi-tsurumi');
        });

        it('cannot be used ("then" needs a card placed)', function () {
            this.player1.clickCard(this.tsurumi);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});

describe('Togashi Tsurumi\'s abilities gained through Contemplative Wisdom', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'togashi-tsurumi', attachments: ['contemplative-wisdom'] }, 'mirumoto-raitsugu'],
                    hand: ['banzai'],
                    conflictDiscard: ['fine-katana', 'ornate-fan', 'let-go']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.tsurumi = this.player1.findCardByName('togashi-tsurumi');
            this.raitsugu = this.player1.findCardByName('mirumoto-raitsugu');
            for(const name of ['fine-katana', 'ornate-fan', 'let-go']) {
                this.player1.player.placeUnderneath(this.player1.findCardByName(name), this.tsurumi);
            }
            this.player1.claimRing('air');
            this.game.checkGameState(true);
        });

        it('counts and fills the cards under the character that gained them', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.raitsugu],
                defenders: [],
                ring: 'fire'
            });
            const military = this.raitsugu.militarySkill;
            this.player2.pass();
            this.player1.clickCard(this.tsurumi);
            this.player1.clickPrompt('Give all abilities to another character');
            this.player1.clickCard(this.raitsugu);
            this.player1.clickRing('air');
            expect(this.raitsugu.militarySkill).toBe(military);

            this.player2.pass();
            this.player1.clickCard(this.raitsugu);
            expect(this.player1).toHavePrompt('Choose a card');
            this.player1.clickCard('banzai');
            expect(this.player1.findCardByName('banzai').isUnderneath(this.raitsugu)).toBe(true);
            expect(this.raitsugu.militarySkill).toBe(military + 1);
        });
    });
});
