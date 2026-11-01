describe('Ikoma Eiji', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'samurai-of-integrity'],
                    dynastyDiscard: ['valiant-oathkeeper']
                },
                player2: {
                    inPlay: ['ikoma-eiji', 'attendant-to-the-emperor'],
                    dynastyDiscard: ['serene-warrior', 'matsu-berserker', 'moto-horde', 'young-philosopher']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.samuraiOfIntegrity = this.player1.findCardByName('samurai-of-integrity');
            this.p1Oathkeeper = this.player1.findCardByName('valiant-oathkeeper');

            this.eiji = this.player2.findCardByName('ikoma-eiji');
            this.sereneWarrior = this.player2.placeCardInProvince('serene-warrior', 'province 1');
            this.motoHorde = this.player2.placeCardInProvince('moto-horde', 'province 2');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.philosopher = this.player2.findCardByName('young-philosopher');
            this.attendant = this.player2.findCardByName('attendant-to-the-emperor');
        });

        it('puts a Bushi character with printed cost 3 or lower into play from your provinces or dynasty discard pile after you lose a political conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: []
            });
            this.noMoreActions();

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.eiji);

            this.player2.clickCard(this.eiji);
            expect(this.player2).toBeAbleToSelect(this.sereneWarrior);
            expect(this.player2).toBeAbleToSelect(this.berserker);
            expect(this.player2).not.toBeAbleToSelect(this.motoHorde);
            expect(this.player2).not.toBeAbleToSelect(this.philosopher);
            expect(this.player2).not.toBeAbleToSelect(this.p1Oathkeeper);

            this.player2.clickCard(this.sereneWarrior);
            expect(this.sereneWarrior.location).toBe('play area');
            expect(this.getChatLogs(5)).toContain('player2 puts Serene Warrior into play with Ikoma Eiji\'s ability');
        });

        it('can put a character into play from the dynasty discard pile', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: []
            });
            this.noMoreActions();

            this.player2.clickCard(this.eiji);
            this.player2.clickCard(this.berserker);
            expect(this.berserker.location).toBe('play area');
        });

        it('triggers when you lose a political conflict as the attacker', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.eiji],
                defenders: [this.whisperer, this.samuraiOfIntegrity]
            });
            this.noMoreActions();

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.eiji);
        });

        it('does not trigger when you lose a military conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.samuraiOfIntegrity],
                defenders: []
            });
            this.noMoreActions();

            expect(this.getChatLogs(10).some((line) => line.startsWith('player1 won a military conflict'))).toBe(true);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
        });

        it('does not trigger when you win a political conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: [this.eiji, this.attendant]
            });
            this.noMoreActions();

            expect(this.getChatLogs(10).some((line) => line.startsWith('player2 won a political conflict'))).toBe(true);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
        });
    });
});
