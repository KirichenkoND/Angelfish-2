import './NavigationCard.scss';

const NavigationCard: React.FC<{ imageUrl: string; title: string; link: string }> = ({ imageUrl, title, link }) => {
    return (
        <a href={link} className="uk-button uk-button-text">
            <div className="uk-card uk-card-default uk-card-hover uk-card-body">
                <div className="uk-card-media-top">
                    <img src={imageUrl} alt={title} />
                </div>
                <div className="uk-card-body">
                    <h3 className="uk-card-title">{title}</h3>
                </div>
            </div>
        </a >
    );
};

export default NavigationCard;