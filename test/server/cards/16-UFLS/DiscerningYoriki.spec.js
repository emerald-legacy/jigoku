describe('Discerning Yoriki', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['eager-scout', 'doji-kuwanan', 'shrewd-investigator'],
                    hand: ['assassination'],
                    conflictDiscard: ['daimyo-s-gunbai']
                },
                player2: {
                    inPlay: ['discerning-yoriki', 'isawa-tadaka-2', 'shrewd-investigator'],
                    hand: ['let-go', 'policy-debate', 'offer-testimony', 'overhear', 'the-perfect-gift'],
                    dynastyDiscard: ['miya-mystic'],
                    conflictDiscard: ['way-of-the-dragon', 'charge', 'banzai'],
                    provinces: ['upholding-authority']
                }
            });

            this.gunbai = this.player1.findCardByName('daimyo-s-gunbai');
            this.assassination = this.player1.findCardByName('assassination');
            this.scout = this.player1.findCardByName('eager-scout');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.shrewdP1 = this.player1.findCardByName('shrewd-investigator');

            this.gift = this.player2.findCardByName('the-perfect-gift');
            this.yoriki = this.player2.findCardByName('discerning-yoriki');
            this.tadaka = this.player2.findCardByName('isawa-tadaka-2');
            this.mystic = this.player2.findCardByName('miya-mystic');
            this.shrewd = this.player2.findCardByName('shrewd-investigator');
            this.overhear = this.player2.findCardByName('overhear');

            this.letGo = this.player2.findCardByName('let-go');
            this.pd = this.player2.findCardByName('policy-debate');
            this.testimony = this.player2.findCardByName('offer-testimony');

            this.dragon = this.player2.moveCard('way-of-the-dragon', 'conflict deck');
            this.charge = this.player2.moveCard('charge', 'conflict deck');
            this.banzai = this.player2.moveCard('banzai', 'conflict deck');

            this.ua = this.player2.findCardByName('upholding-authority');
        });

        it('should trigger when you look at a card', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.scout],
                defenders: [this.shrewd],
                type: 'political',
                province: this.ua
            });

            this.player2.clickCard(this.shrewd);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.yoriki);
        });

        it('should let you choose and honor a character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.scout],
                defenders: [this.shrewd],
                type: 'political',
                province: this.ua
            });

            this.player2.clickCard(this.shrewd);
            this.player2.clickCard(this.yoriki);
            expect(this.player2).toHavePrompt('Choose a character to honor');

            expect(this.player2).toBeAbleToSelect(this.shrewd);
            expect(this.player2).toBeAbleToSelect(this.yoriki);
            expect(this.player2).toBeAbleToSelect(this.scout);

            this.player2.clickCard(this.shrewd);
            expect(this.shrewd.isHonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 uses Discerning Yoriki to honor Shrewd Investigator');
        });
    });
});

describe('Discerning Yoriki - revealed cards and own hand', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'shrewd-investigator'],
                    hand: ['assassination', 'banzai']
                },
                player2: {
                    inPlay: ['discerning-yoriki', 'shrewd-investigator'],
                    hand: ['offer-testimony', 'let-go', 'ornate-fan']
                }
            });

            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.shrewdP1 = this.player1.findCardByName('shrewd-investigator');
            this.banzai = this.player1.findCardByName('banzai');

            this.yoriki = this.player2.findCardByName('discerning-yoriki');
            this.shrewd = this.player2.findCardByName('shrewd-investigator');
            this.testimony = this.player2.findCardByName('offer-testimony');
            this.letGo = this.player2.findCardByName('let-go');
        });

        it('should trigger when cards in an opponent\'s hand are revealed', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: [this.shrewd]
            });

            this.player2.clickCard(this.testimony);
            this.player2.clickCard(this.shrewd);
            this.player1.clickCard(this.whisperer);
            expect(this.player2).toHavePrompt('Choose a card to reveal');
            this.player2.clickCard(this.letGo);
            expect(this.player1).toHavePrompt('Choose a card to reveal');
            this.player1.clickCard(this.banzai);
            expect(this.getChatLogs(10)).toContain('player1 reveals Banzai! due to Offer Testimony');

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.yoriki);
            this.player2.clickCard(this.yoriki);
            expect(this.player2).toHavePrompt('Choose a character to honor');
            this.player2.clickCard(this.yoriki);
            expect(this.yoriki.isHonored).toBe(true);
        });

        it('should not trigger when an opponent looks at cards in your hand', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.shrewdP1],
                defenders: [this.shrewd]
            });

            this.player2.pass();
            this.player1.clickCard(this.shrewdP1);
            expect(this.getChatLogs(5)).toContain('player1 uses Shrewd Investigator to look at 3 random cards in player2\'s hand');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.yoriki.isHonored).toBe(false);
        });
    });
});
